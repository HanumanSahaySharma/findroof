import { z } from "zod";
import { app } from "@/firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ICurrentUser } from "@/store/user/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { ILoading, setLoading } from "@/store/loading/loadingSlice";
import { Loader2, LucideTrash2, ArrowLeft, UploadCloudIcon } from "lucide-react";
import { Form, FormField, FormControl, FormLabel, FormMessage, FormItem, FormDescription } from "@/components/ui/form";
import { BATHROOMS, BEDROOMS, ESSENTIALS, FEATURES, PROPERTY_FOR, PROPERTY_TYPE, SEFETY_FEATURES } from "@/const";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  UploadTaskSnapshot,
  deleteObject,
} from "firebase/storage";

import Heading from "./Heading";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const FormSchema = z.object({
  images: z.array(z.string()),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  price: z.string().min(1, {
    message: "Enter property base price.",
  }),
  propertyType: z.string().min(1, {
    message: "Choose the property type.",
  }),
  propertyFor: z.string().min(1, {
    message: "Choose the property for.",
  }),
  bedrooms: z.string().min(1, {
    message: "Choose the number of bedrooms.",
  }),
  bathrooms: z.string().min(1, {
    message: "Choose the number of bathrooms.",
  }),
  essentials: z.array(z.string()),
  features: z.array(z.string()),
  sefetyFeatures: z.array(z.string()),
});

export default function AddProperty() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: { loading: ILoading }) => state.loading);
  const { currentUser } = useSelector((state: { user: ICurrentUser }) => state.user);

  const [images, setImages] = useState<FileList | null>(null);
  const [imagesUrl, setImagesUrl] = useState<string[] | null>(null);
  const [uploadedImagesUrl, setUploadedImageUrl] = useState<string[] | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const propertyImagesRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      images: [],
      name: "",
      description: "",
      price: "",
      propertyType: "",
      propertyFor: "",
      bedrooms: "",
      bathrooms: "",
      essentials: [],
      features: [],
      sefetyFeatures: [],
    },
  });

  const handleImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (nameInputRef.current?.value === "") {
      setUploadError("Please enter property name before uploading images.");
      return;
    }
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgUrls = URL.createObjectURL(file);
        urls.push(imgUrls);
      }
      setImagesUrl(urls);
      setImages(files);
      setUploadError(null);
    }
  };

  const uploadPropertyImages = async (files: FileList | null) => {
    if (!files) return;
    const propertyName = nameInputRef.current?.value.split(" ").join("-").toLowerCase();
    const storage = getStorage(app);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;
      const storageRef = ref(storage, `/${propertyName}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Number(progress.toFixed(0)));
        },
        (error: any) => {
          setUploadError(error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadedImageUrl((prevUrl) => {
            if (Array.isArray(prevUrl)) {
              return [...prevUrl, downloadURL];
            }
            return [downloadURL];
          });
          setProgress(null);
        }
      );
    }
  };

  const deleteUploadedImage = async (url: string) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `${url}`);
    try {
      await deleteObject(storageRef);
      toast.success("Image deleted");
      setUploadedImageUrl((prevUrls) => prevUrls.filter((prevUrl) => prevUrl !== url));
    } catch (error) {
      console.log(error);
    }
  };

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
  }

  useEffect(() => {
    if (images) {
      uploadPropertyImages(images);
    }
  }, [images]);

  return (
    <div className="container max-w-screen-2xl ">
      <div className="my-8 p-6 md:p-10 bg-white rounded-xl shadow-md custom-min-h-screen">
        <div className="flex items-center mb-8">
          <Link
            to="/dashboard?tab=properties"
            className="mr-5 p-0.5 rounded-md bg-gradient-to-r text-white from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
          >
            <span className="p-1.5 bg-white flex items-center text-red-500 rounded">
              <ArrowLeft size={20} />
            </span>
          </Link>
          <Heading title="Add Property" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="md:grid md:grid-cols-12 mb-5 gap-10">
              <div className="space-y-6 md:col-span-5 order-2">
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <Label>Upload Images</Label>
                      <Input
                        onChange={(e) => handleImagesUpload(e)}
                        multiple
                        type="file"
                        ref={propertyImagesRef}
                        className="hidden"
                      />
                      <div className="relative flex items-center flex-col bg-slate-100  border border-dashed border-slate-400 p-4 rounded-md">
                        {progress !== null && progress <= 100 && (
                          <CircularProgressbar
                            className="absolute"
                            value={progress}
                            text={`${progress}%`}
                            strokeWidth={4}
                            styles={{
                              root: {
                                width: "40px",
                                height: "40px",
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "white",
                                borderRadius: "50%",
                              },
                              trail: {
                                stroke: "#d6d6d6",
                              },
                              path: {
                                stroke: `rgba(240, 68, 68, ${progress / 100})`,
                                strokeLinecap: "butt",
                                background: "transparent",
                              },
                              text: {
                                fontSize: "24px",
                                fontWeight: "bold",
                                fill: "rgb(240, 68, 68)",
                                position: "absolute",
                              },
                            }}
                          />
                        )}
                        <UploadCloudIcon size={80} />
                        <p className="mb-2 text-slate-600">
                          Drag and drop here or
                          <span
                            onClick={() => propertyImagesRef.current?.click()}
                            className="ml-1 text-red-500 cursor-pointer hover:text-red-600 hover:underline"
                          >
                            Browse
                          </span>
                        </p>
                        <p className="text-sm text-slate-400">Images should be in JPEG or PNG Format.</p>
                      </div>
                      <FormDescription>
                        The first uploaded photo will become the cover image of the property.
                      </FormDescription>
                      <FormMessage className="text-sm font-normal" />
                    </FormItem>
                  )}
                ></FormField>
                {uploadError && (
                  <Alert variant="destructive">
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
                {uploadedImagesUrl && uploadedImagesUrl.length > 0 && (
                  <div>
                    <h2 className="font-semibold mb-2 text-sm my-10">Uploaded Images</h2>
                    <div className="bg-slate-100 p-2 rounded-md grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {uploadedImagesUrl.map((imgUrl, index) => (
                        <div key={index} className="group relative w-20">
                          <div
                            className="w-20 h-20 rounded-md bg-cover"
                            style={{
                              backgroundImage: `url(${imgUrl})`,
                              backgroundRepeat: "no-repeat",
                            }}
                          />
                          <div
                            onClick={() => deleteUploadedImage(imgUrl)}
                            className="invisible group-hover:visible text-white bg-red-400 hover:bg-red-500 group-hover:opacity-100 hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[1]"
                          >
                            <LucideTrash2 size={18} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-6 md:col-span-7">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Name</FormLabel>
                      <FormControl>
                        <Input {...field} ref={nameInputRef} />
                      </FormControl>
                      <FormMessage className="text-sm font-normal" />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={10} className="resize-none" />
                      </FormControl>
                      <FormMessage className="text-sm font-normal" />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage className="text-sm font-normal" />
                    </FormItem>
                  )}
                ></FormField>
                <h2 className="my-5 font-medium uppercase text-slate-800 border-b border-b-slate-300 pb-2">
                  Property Type and For
                </h2>
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          {PROPERTY_TYPE.map((type, index) => (
                            <FormItem key={index} className="flex flex-wrap items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={type.toLowerCase()} />
                              </FormControl>
                              <FormLabel className="text-slate-800 font-normal">{type}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-sm font-normal" />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="propertyFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">For</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-5">
                          {PROPERTY_FOR.map((type, index) => (
                            <FormItem key={index} className="flex flex-wrap items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={type.toLowerCase()} />
                              </FormControl>
                              <FormLabel className="text-slate-800 font-normal">{type}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-sm font-normal" />
                    </FormItem>
                  )}
                ></FormField>

                <h2 className="my-5 font-medium uppercase text-slate-800 border-b border-b-slate-300 pb-2">
                  Rooms and Beds
                </h2>
                <FormField
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Bedrooms</FormLabel>
                      <FormControl>
                        <RadioGroup
                          id="bedrooms"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          {BEDROOMS.map((bedroom, index) => (
                            <FormItem key={index} className="flex flex-wrap items-center space-x-0 space-y-0">
                              <RadioGroupItem
                                value={bedroom}
                                id={`bedroom-${bedroom}`}
                                className="custom-radio hidden"
                              />
                              <FormLabel
                                htmlFor={`bedroom-${bedroom}`}
                                className="text-slate-800 font-medium py-2 px-6 border border-slate-300 rounded-full cursor-pointer hover:bg-slate-200 transition-background duration-300"
                              >
                                {bedroom}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-sm font-normal" />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Bathrooms</FormLabel>
                      <FormControl>
                        <RadioGroup
                          id="bathrooms"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          {BATHROOMS.map((bathroom, index) => (
                            <div key={index} className="flex flex-wrap items-center space-x-0 space-y-0">
                              <RadioGroupItem
                                value={bathroom}
                                id={`bathroom-${bathroom}`}
                                className="custom-radio hidden"
                              />
                              <Label
                                htmlFor={`bathroom-${bathroom}`}
                                className="text-slate-800 font-medium py-2 px-6 border border-slate-300 rounded-full cursor-pointer hover:bg-slate-200 transition-background duration-300"
                              >
                                {bathroom}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-sm font-normal" />
                    </FormItem>
                  )}
                ></FormField>

                <h2 className="my-2 font-medium uppercase text-slate-800 border-b border-b-slate-300 pb-2">
                  Amenities
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="essentials"
                    render={({ field }) => (
                      <FormItem className="bg-slate-100 p-5 rounded-md">
                        <h3 className="font-medium mb-2">Essetails</h3>
                        {ESSENTIALS.map((item) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 pb-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-slate-800">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                        <FormMessage className="text-sm font-normal" />
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem className="bg-slate-100 p-5 rounded-md">
                        <h3 className="font-medium mb-2">Features</h3>
                        {FEATURES.map((item) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 pb-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-slate-800">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                        <FormMessage className="text-sm font-normal" />
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form.control}
                    name="sefetyFeatures"
                    render={({ field }) => (
                      <FormItem className="bg-slate-100 p-5 rounded-md">
                        <h3 className="font-medium mb-2">Safety</h3>
                        {SEFETY_FEATURES.map((item) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 pb-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-slate-800">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                        <FormMessage className="text-sm font-normal" />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={false}
              className="min-w-40 bg-gradient-to-r from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
            >
              {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Add"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
