import { z } from "zod";
import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormLabel, FormMessage, FormItem, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { Link } from "react-router-dom";
import Heading from "./Heading";
import { ArrowLeft, UploadCloudIcon } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { ILoading, setLoading } from "@/store/loading/loadingSlice";
import { ICurrentUser } from "@/store/user/userSlice";
import { BATHROOMS, BEDROOMS, ESSENTIALS, FEATURES, PROPERTY_FOR, PROPERTY_TYPE, SEFETY_FEATURES } from "@/const";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const FormSchema = z.object({
  images: z.array(z.string()),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  price: z.string().nonempty({
    message: "Enter property base price.",
  }),
  propertyType: z.string().nonempty({
    message: "Choose the property type.",
  }),
  propertyFor: z.string().nonempty({
    message: "Choose the property for.",
  }),
  bedrooms: z.string().nonempty({
    message: "Choose the number of bedrooms.",
  }),
  bathrooms: z.string().nonempty({
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

  const propertyImagesRef = useRef<HTMLInputElement>(null);

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
  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
  }
  return (
    <div className="container max-w-screen-2xl ">
      <div className="my-8 p-6 md:p-10 bg-white rounded-xl shadow-md custom-min-h-screen">
        <div className="flex items-center mb-10">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="md:grid md:grid-cols-12 mb-5 gap-10">
              <div className="space-y-6 md:col-span-5 order-2">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Upload Images</Label>
                      <Input multiple type="file" ref={propertyImagesRef} className="hidden" />
                      <div className="flex items-center flex-col bg-slate-100 border-dashed border-slate-400 p-10 rounded-md">
                        <UploadCloudIcon size={80} />
                        <p className="mb-2 text-slate-600">
                          Drag and drop here or
                          <span
                            onClick={() => propertyImagesRef.current?.click()}
                            className="ml-1 underline text-pink-600 cursor-pointer hover:text-pink-800"
                          >
                            Browse
                          </span>
                        </p>
                        <p className="text-sm text-slate-400">Images should be in JPEG or PNG Format.</p>
                      </div>
                      <FormDescription>
                        The first uploaded photo will become the cover image of the property.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-6 md:col-span-7">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <h2 className="my-5 font-medium uppercase text-slate-800 border-b border-b-slate-300 pb-2">
                  Type and For
                </h2>
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Property Type</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="propertyFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800">Property For</FormLabel>
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
