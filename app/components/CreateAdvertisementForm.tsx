import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { uploadImage } from "@/app/lib/utils/cloudinaryUtils";

const CreateAdvertisementForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    video: null,
    start_date: "",
    end_date: "",
    status: "",
    target_audience: "",
    budget: "",
    cta_text: "",
    cta_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.image) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Upload image to Cloudinary
      const imageFile = formData.image as File;
      const imageResult = await uploadImage(imageFile, "advertisements");

      if (!imageResult.success || !imageResult.url) {
        throw new Error(imageResult.error || "Failed to upload image");
      }

      // Upload video to Cloudinary if provided
      let videoUrl = null;
      if (formData.video) {
        const videoFile = formData.video as File;
        const videoResult = await uploadImage(videoFile, "advertisements");

        if (!videoResult.success || !videoResult.url) {
          throw new Error(videoResult.error || "Failed to upload video");
        }

        videoUrl = videoResult.url;
      }

      // Prepare the data for the API call
      const data = {
        title: formData.title,
        description: formData.description,
        image_url: imageResult.url,
        video_url: videoUrl,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        target_audience: formData.target_audience,
        budget: formData.budget,
        cta_text: formData.cta_text,
        cta_url: formData.cta_url,
      };

      // Call the API to create the advertisement
      const response = await fetch("/api/advertisements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create advertisement");
      }

      toast.success("Advertisement created successfully!");
      router.push("/advertisements");
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create advertisement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div>{/* Render your form here */}</div>;
};

export default CreateAdvertisementForm;
