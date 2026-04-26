import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    photographer: ''
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // TODO: Implement file upload to backend API
      console.log('Uploading gallery:', formData, files);
      alert('Admin upload feature coming soon! Backend endpoint needed.');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload gallery');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-400">Upload and manage galleries</p>
      </div>

      <Card className="border-gray-800 bg-gray-950">
        <CardHeader>
          <CardTitle>Create New Gallery</CardTitle>
          <CardDescription>Upload images and organize them into a gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Gallery Title</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter gallery title"
                required
                className="bg-gray-900 border-gray-700"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter gallery description"
                className="bg-gray-900 border-gray-700 min-h-[120px]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={formData.category} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="people">People</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Photographer */}
            <div>
              <label className="block text-sm font-medium mb-2">Photographer Name</label>
              <Input
                type="text"
                name="photographer"
                value={formData.photographer}
                onChange={handleInputChange}
                placeholder="Enter photographer name"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <Input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. landscape, sunset, nature"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload Images</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-400">
                    {files.length > 0 ? (
                      <div>
                        <p className="font-medium">{files.length} files selected</p>
                        <div className="text-sm mt-2 space-y-1">
                          {Array.from(files).map((file, i) => (
                            <p key={i}>{file.name}</p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium">Drag and drop images here</p>
                        <p className="text-sm">or click to browse</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={uploading || !formData.title || files.length === 0}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              {uploading ? 'Uploading...' : 'Create Gallery'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Gallery Management Section */}
      <Card className="border-gray-800 bg-gray-950">
        <CardHeader>
          <CardTitle>Manage Galleries</CardTitle>
          <CardDescription>Edit or delete existing galleries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-8">
            <p>Gallery management interface coming soon</p>
            <p className="text-sm">Backend endpoint for listing user galleries needed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
