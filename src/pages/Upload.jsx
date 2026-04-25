import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Images, Info, Link as LinkIcon, PlusCircle, Star, Upload as UploadIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createAlbum,
  createBulkEmbeddedPhotos,
  createCategory,
  createChannel,
  createPhotoEntry,
  createStar,
  getAlbums,
  getCategories,
  getChannels,
  getStars,
} from "../lib/content";
import { optimizeImageUrl } from "../lib/imageUtils";

const defaultForm = {
  title: "",
  photographer: "",
  category: "",
  channel: "",
  album: "",
  star: "",
  tags: "",
  description: "",
  url: "",
};

const defaultEntityForms = {
  category: { name: "", description: "", coverImage: "", thumbnailUrl: "" },
  channel: { name: "", description: "", logoUrl: "", website: "", tags: "", thumbnailUrl: "" },
  album: { name: "", description: "", coverImage: "", channel: "", star: "", thumbnailUrl: "" },
  star: { name: "", bio: "", avatarUrl: "", tags: "", thumbnailUrl: "" },
};

function toTagArray(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildThumbnail(url) {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
  return optimizeImageUrl(url, 480, 72);
}

export default function Upload() {
  const navigate = useNavigate();
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [mode, setMode] = useState("single");
  const [form, setForm] = useState(defaultForm);
  const [bulkUrls, setBulkUrls] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [entityForms, setEntityForms] = useState(defaultEntityForms);
  const [recentCreated, setRecentCreated] = useState([]);

  const categories = useMemo(() => getCategories(), [catalogVersion]);
  const channels = useMemo(() => getChannels(), [catalogVersion]);
  const albums = useMemo(() => getAlbums(), [catalogVersion]);
  const stars = useMemo(() => getStars(), [catalogVersion]);

  const hydratedForm = {
    ...form,
    category: form.category || categories[0]?.id || "",
    channel: form.channel || channels[0]?.slug || "",
    album: form.album || albums[0]?.slug || "",
    star: form.star || stars[0]?.slug || "",
  };

  const activePreview =
    selectedFile ? previewUrl : hydratedForm.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80";
  const discoveryPreview = customThumbnailUrl || buildThumbnail(activePreview);
  const parsedBulkUrls = bulkUrls.split("\n").map((line) => line.trim()).filter(Boolean);
  const entityPreviewImages = {
    category: entityForms.category.thumbnailUrl || entityForms.category.coverImage,
    channel: entityForms.channel.thumbnailUrl || entityForms.channel.logoUrl,
    album: entityForms.album.thumbnailUrl || entityForms.album.coverImage,
    star: entityForms.star.thumbnailUrl || entityForms.star.avatarUrl,
  };

  const refreshCatalog = () => setCatalogVersion((value) => value + 1);

  const updateEntityForm = (entity, key, value) => {
    setEntityForms((current) => ({
      ...current,
      [entity]: {
        ...current[entity],
        [key]: value,
      },
    }));
  };

  const resetMainForm = () => {
    setForm(defaultForm);
    setSelectedFile(null);
    setPreviewUrl("");
    setCustomThumbnailUrl("");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(await fileToDataUrl(file));
  };

  const handleCustomThumbnailChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCustomThumbnailUrl(await fileToDataUrl(file));
  };

  const handleEntityThumbnailChange = async (entity, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateEntityForm(entity, "thumbnailUrl", await fileToDataUrl(file));
  };

  const handleCreateEntity = (entity) => {
    if (entity === "category" && entityForms.category.name.trim()) {
      const created = createCategory({
        name: entityForms.category.name.trim(),
        description: entityForms.category.description.trim(),
        coverImage: entityForms.category.coverImage.trim(),
        thumbnailUrl: entityForms.category.thumbnailUrl.trim(),
      });
      setForm((current) => ({ ...current, category: created.id }));
    }

    if (entity === "channel" && entityForms.channel.name.trim()) {
      const created = createChannel({
        name: entityForms.channel.name.trim(),
        description: entityForms.channel.description.trim(),
        logoUrl: entityForms.channel.logoUrl.trim(),
        thumbnailUrl: entityForms.channel.thumbnailUrl.trim(),
        website: entityForms.channel.website.trim(),
        tags: toTagArray(entityForms.channel.tags),
      });
      setForm((current) => ({ ...current, channel: created.slug }));
    }

    if (entity === "star" && entityForms.star.name.trim()) {
      const created = createStar({
        name: entityForms.star.name.trim(),
        bio: entityForms.star.bio.trim(),
        avatarUrl: entityForms.star.avatarUrl.trim(),
        thumbnailUrl: entityForms.star.thumbnailUrl.trim(),
        tags: toTagArray(entityForms.star.tags),
      });
      setForm((current) => ({ ...current, star: created.slug }));
    }

    if (entity === "album" && entityForms.album.name.trim()) {
      const created = createAlbum({
        name: entityForms.album.name.trim(),
        description: entityForms.album.description.trim(),
        coverImage: entityForms.album.coverImage.trim(),
        thumbnailUrl: entityForms.album.thumbnailUrl.trim(),
        channel: entityForms.album.channel || hydratedForm.channel,
        star: entityForms.album.star || hydratedForm.star,
      });
      setForm((current) => ({ ...current, album: created.slug }));
    }

    setEntityForms(defaultEntityForms);
    refreshCatalog();
  };

  const handleSingleCreate = async () => {
    setSaving(true);
    const sourceUrl = selectedFile ? previewUrl : hydratedForm.url.trim();
    const customThumb = customThumbnailUrl || buildThumbnail(sourceUrl);
    const photo = createPhotoEntry({
      title: hydratedForm.title || "Untitled set",
      photographer: hydratedForm.photographer || "Guest creator",
      category: hydratedForm.category,
      channel: hydratedForm.channel,
      album: hydratedForm.album,
      star: hydratedForm.star,
      tags: toTagArray(hydratedForm.tags),
      description: hydratedForm.description,
      url: sourceUrl,
      thumbnailUrl: customThumb,
      sourceType: selectedFile ? "upload" : "embed",
    });
    setRecentCreated([photo]);
    setSaving(false);
    resetMainForm();
    navigate(`/uploaded/${photo.id}`, { state: { preview: photo } });
  };

  const handleBulkCreate = () => {
    if (!parsedBulkUrls.length) return;
    setSaving(true);
    const created = createBulkEmbeddedPhotos(
      parsedBulkUrls.map((url, index) => ({
        title: `${hydratedForm.title || "Bulk set"} ${index + 1}`,
        photographer: hydratedForm.photographer || "Guest creator",
        category: hydratedForm.category,
        channel: hydratedForm.channel,
        album: hydratedForm.album,
        star: hydratedForm.star,
        tags: toTagArray(hydratedForm.tags),
        description: hydratedForm.description,
        url,
        thumbnailUrl: customThumbnailUrl || buildThumbnail(url),
        sourceType: "embed",
      }))
    );
    setRecentCreated(created);
    setSaving(false);
    setBulkUrls("");
    navigate(`/uploaded/${created[0].id}`, { state: { preview: created[0] } });
  };

  const entitySections = [
    {
      id: "category",
      title: "Create category",
      icon: PlusCircle,
      body: (
        <>
          <Input value={entityForms.category.name} onChange={(event) => updateEntityForm("category", "name", event.target.value)} placeholder="Velvet pool nights" />
          <Input value={entityForms.category.coverImage} onChange={(event) => updateEntityForm("category", "coverImage", event.target.value)} placeholder="Cover image URL" />
          <Input value={entityForms.category.thumbnailUrl} onChange={(event) => updateEntityForm("category", "thumbnailUrl", event.target.value)} placeholder="Category thumbnail URL" />
          <Input type="file" accept="image/*" onChange={(event) => handleEntityThumbnailChange("category", event)} />
          <Textarea rows={2} value={entityForms.category.description} onChange={(event) => updateEntityForm("category", "description", event.target.value)} placeholder="Short mood note" />
        </>
      ),
    },
    {
      id: "channel",
      title: "Create channel",
      icon: FolderPlus,
      body: (
        <>
          <Input value={entityForms.channel.name} onChange={(event) => updateEntityForm("channel", "name", event.target.value)} placeholder="Midnight members" />
          <Input value={entityForms.channel.logoUrl} onChange={(event) => updateEntityForm("channel", "logoUrl", event.target.value)} placeholder="Logo image URL" />
          <Input value={entityForms.channel.thumbnailUrl} onChange={(event) => updateEntityForm("channel", "thumbnailUrl", event.target.value)} placeholder="Channel thumbnail URL" />
          <Input type="file" accept="image/*" onChange={(event) => handleEntityThumbnailChange("channel", event)} />
          <Input value={entityForms.channel.website} onChange={(event) => updateEntityForm("channel", "website", event.target.value)} placeholder="Optional website" />
          <Input value={entityForms.channel.tags} onChange={(event) => updateEntityForm("channel", "tags", event.target.value)} placeholder="night, luxury, private" />
          <Textarea rows={2} value={entityForms.channel.description} onChange={(event) => updateEntityForm("channel", "description", event.target.value)} placeholder="Short channel note" />
        </>
      ),
    },
    {
      id: "album",
      title: "Create album",
      icon: Images,
      body: (
        <>
          <Input value={entityForms.album.name} onChange={(event) => updateEntityForm("album", "name", event.target.value)} placeholder="Suite drop 01" />
          <Input value={entityForms.album.coverImage} onChange={(event) => updateEntityForm("album", "coverImage", event.target.value)} placeholder="Cover image URL" />
          <Input value={entityForms.album.thumbnailUrl} onChange={(event) => updateEntityForm("album", "thumbnailUrl", event.target.value)} placeholder="Album thumbnail URL" />
          <Input type="file" accept="image/*" onChange={(event) => handleEntityThumbnailChange("album", event)} />
          <Select value={entityForms.album.channel || hydratedForm.channel} onValueChange={(value) => updateEntityForm("album", "channel", value)}>
            <SelectTrigger><SelectValue placeholder="Album channel" /></SelectTrigger>
            <SelectContent>{channels.map((channel) => <SelectItem key={channel.slug} value={channel.slug}>{channel.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={entityForms.album.star || hydratedForm.star} onValueChange={(value) => updateEntityForm("album", "star", value)}>
            <SelectTrigger><SelectValue placeholder="Album star" /></SelectTrigger>
            <SelectContent>{stars.map((star) => <SelectItem key={star.slug} value={star.slug}>{star.name}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea rows={2} value={entityForms.album.description} onChange={(event) => updateEntityForm("album", "description", event.target.value)} placeholder="Short album note" />
        </>
      ),
    },
    {
      id: "star",
      title: "Create star",
      icon: Star,
      body: (
        <>
          <Input value={entityForms.star.name} onChange={(event) => updateEntityForm("star", "name", event.target.value)} placeholder="Aria Noir" />
          <Input value={entityForms.star.avatarUrl} onChange={(event) => updateEntityForm("star", "avatarUrl", event.target.value)} placeholder="Avatar image URL" />
          <Input value={entityForms.star.thumbnailUrl} onChange={(event) => updateEntityForm("star", "thumbnailUrl", event.target.value)} placeholder="Star thumbnail URL" />
          <Input type="file" accept="image/*" onChange={(event) => handleEntityThumbnailChange("star", event)} />
          <Input value={entityForms.star.tags} onChange={(event) => updateEntityForm("star", "tags", event.target.value)} placeholder="glam, late night, suite" />
          <Textarea rows={2} value={entityForms.star.bio} onChange={(event) => updateEntityForm("star", "bio", event.target.value)} placeholder="Short star bio" />
        </>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-[0_22px_60px_rgba(18,20,34,0.08)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Local creator tools</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Thumbnail-ready</span>
          </div>
          <h1 className="mt-5 font-display text-5xl">Upload fast and control exactly what discovery cards show</h1>

          <div className="mt-6 rounded-[1.5rem] border border-dashed border-border bg-background/60 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">
                Everything here stays local to this browser. You can create categories, channels, albums, stars, and custom images with separate discovery thumbnails and no backend.
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-2 rounded-full bg-secondary p-1">
            <button type="button" onClick={() => setMode("single")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === "single" ? "bg-foreground text-background" : "text-muted-foreground"}`}>
              Single upload
            </button>
            <button type="button" onClick={() => setMode("bulk")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === "bulk" ? "bg-foreground text-background" : "text-muted-foreground"}`}>
              Bulk embed
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block">Title</Label>
              <Input value={hydratedForm.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder={mode === "bulk" ? "After dark drop" : "Single hero title"} />
            </div>
            <div>
              <Label className="mb-2 block">Photographer</Label>
              <Input value={hydratedForm.photographer} onChange={(event) => setForm((current) => ({ ...current, photographer: event.target.value }))} placeholder="Creator or studio" />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block">Category</Label>
              <Select value={hydratedForm.category} onValueChange={(value) => setForm((current) => ({ ...current, category: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Channel</Label>
              <Select value={hydratedForm.channel} onValueChange={(value) => setForm((current) => ({ ...current, channel: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{channels.map((channel) => <SelectItem key={channel.slug} value={channel.slug}>{channel.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block">Album</Label>
              <Select value={hydratedForm.album} onValueChange={(value) => setForm((current) => ({ ...current, album: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{albums.map((album) => <SelectItem key={album.slug} value={album.slug}>{album.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Star</Label>
              <Select value={hydratedForm.star} onValueChange={(value) => setForm((current) => ({ ...current, star: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{stars.map((star) => <SelectItem key={star.slug} value={star.slug}>{star.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label className="mb-2 block">Tags</Label>
            <Input value={hydratedForm.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} placeholder="night, suite, glam, private" />
          </div>

          <div className="mt-4">
            <Label className="mb-2 block">Description</Label>
            <Textarea rows={3} value={hydratedForm.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Keep it short. This build is meant to stay image-first." />
          </div>

          {mode === "single" ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block">Upload image</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              <div>
                <Label className="mb-2 block">Or image URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={hydratedForm.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="pl-10" placeholder="https://example.com/set.jpg" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <Label className="mb-2 block">Bulk embed URLs</Label>
              <Textarea rows={7} value={bulkUrls} onChange={(event) => setBulkUrls(event.target.value)} placeholder={"https://example.com/shot-01.jpg\nhttps://example.com/shot-02.jpg\nhttps://example.com/shot-03.jpg"} />
              <p className="mt-2 text-xs text-muted-foreground">
                {parsedBulkUrls.length} URLs ready. The app does not impose a bulk embed cap, though very large drops are still subject to browser memory and local storage limits.
              </p>
            </div>
          )}

          <div className="mt-4 rounded-[1.5rem] border border-dashed border-border bg-background/60 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">
                Custom thumbnail: upload a separate image to use across gallery cards. If you skip it, the main image will be optimized as the thumbnail.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Label className="mb-2 block">Custom thumbnail (optional)</Label>
            <Input type="file" accept="image/*" onChange={handleCustomThumbnailChange} />
            {customThumbnailUrl ? (
              <div className="mt-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-700">Custom thumbnail ready</div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={mode === "single" ? handleSingleCreate : handleBulkCreate} disabled={saving || (mode === "single" ? !(previewUrl || hydratedForm.url) : !parsedBulkUrls.length)}>
              <UploadIcon className="mr-2 h-4 w-4" />
              {saving ? "Saving locally..." : mode === "single" ? "Create local image" : `Embed ${parsedBulkUrls.length || ""} images`}
            </Button>
            <Button variant="secondary" onClick={resetMainForm}>Reset</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 shadow-[0_22px_60px_rgba(18,20,34,0.08)]">
            <img src={optimizeImageUrl(activePreview, 1200)} alt="Preview" className="h-[26rem] w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Full image preview</p>
              <h2 className="mt-2 text-2xl font-semibold">{hydratedForm.title || "Image-first preview"}</h2>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 shadow-[0_22px_60px_rgba(18,20,34,0.08)]">
            <img src={discoveryPreview} alt="Discovery thumbnail preview" className="h-[12rem] w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Discovery thumbnail preview</p>
              <p className="mt-1 text-sm text-muted-foreground">This smaller image is what home and listing cards will show.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {entitySections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-[0_18px_50px_rgba(18,20,34,0.08)]">
                  <div className="mb-4 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">{section.title}</h3>
                  </div>
                  <div className="space-y-3">{section.body}</div>
                  {entityPreviewImages[section.id] ? (
                    <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-border/70 bg-background/60">
                      <img src={entityPreviewImages[section.id]} alt={`${section.title} thumbnail preview`} className="h-28 w-full object-cover" />
                      <div className="px-3 py-2 text-xs text-muted-foreground">Entity discovery thumbnail preview</div>
                    </div>
                  ) : null}
                  <Button className="mt-4 w-full" variant="secondary" onClick={() => handleCreateEntity(section.id)}>
                    Save locally
                  </Button>
                </div>
              );
            })}
          </div>

          {recentCreated.length > 0 ? (
            <div className="rounded-[2rem] border border-border/70 bg-card/85 p-5 shadow-[0_18px_50px_rgba(18,20,34,0.08)]">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Recently created</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {recentCreated.map((photo) => (
                  <button key={photo.id} type="button" onClick={() => navigate(`/uploaded/${photo.id}`, { state: { preview: photo } })} className="overflow-hidden rounded-[1.25rem] bg-secondary text-left">
                    <img src={optimizeImageUrl(photo.thumbnailUrl || photo.url, 700)} alt={photo.title} className="h-36 w-full object-cover" />
                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-semibold">{photo.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{photo.photographer}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
