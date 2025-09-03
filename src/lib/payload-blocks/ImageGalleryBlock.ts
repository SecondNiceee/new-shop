import { Block } from "payload";

export const ImageGalleryBlock: Block = {
  slug: "imageGallery",
  labels: {
    singular: "Image Gallery",
    plural: "Image Galleries",
  },
  fields: [
    {
      name: "images",
      type: "array",
      label: "Images",
      minRows: 1,
      maxRows: 12,
      required: true,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "columns",
      type: "select",
      label: "Columns",
      defaultValue: "3",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
      ],
    }
  ],
}
