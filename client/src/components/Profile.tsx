import { z } from "zod";
import axios from "axios";
import { app } from "@/firebase";
import { toast } from "react-toastify";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Loader2, LucideImage } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { ILoading, setLoading } from "@/store/loading/loadingSlice";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import Heading from "@/components/Heading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ICurrentUser, signInUser, signOutUser } from "@/store/user/userSlice";

import { getStorage, uploadBytesResumable, ref, getDownloadURL, UploadTaskSnapshot } from "firebase/storage";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface FormValues {
  profileImage: string | null;
  name: string;
  email: string;
  password: string;
}

const formSchema = z.object({
  profileImage: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(5),
});

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state: { loading: ILoading }) => state.loading);
  const { currentUser } = useSelector((state: { user: ICurrentUser }) => state.user);

  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const profileImageRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
      const imageFileUrl = URL.createObjectURL(file);
      setImageFileUrl(imageFileUrl);
    }
  };

  const uploadProfileImage = async () => {
    setUploadError(null);
    if (!imageFile) {
      return false;
    }
    const storage = getStorage(app);
    const fileName = imageFile.name;
    const storageRef = ref(storage, `/profile/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Number(progress.toFixed()));
      },
      (_error) => {
        setImageFileUrl(null);
        setUploadProgress(null);
        setUploadError("Could not upload image (file must be less than 2 MB)");
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setImageFileUrl(downloadUrl);
        setUploadProgress(null);
        toast.success("Profile image upload successfully.");
      }
    );
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileImage: currentUser?.profileImage || null,
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    dispatch(setLoading(true));
    if (imageFileUrl) {
      values.profileImage = imageFileUrl;
    }
    try {
      const res = await axios.put(`/api/user/update/${currentUser?._id}`, values);
      if (res.status === 200) {
        dispatch(setLoading(false));
        toast.success(res.data.message);
        dispatch(signInUser(res.data.user));
      }
    } catch (error: any) {
      dispatch(setLoading(false));
      setError(error.response.data.message);
      if (error.response.status === 401) {
        dispatch(signOutUser());
        navigate("/signin");
      }
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadProfileImage();
    }
  }, [imageFile]);

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(`/api/user/delete/${currentUser?._id}`);
      if (res.status === 200) {
        toast.success(res.data.message);
        dispatch(signOutUser());
        navigate("/signin");
      }
    } catch (error: any) {
      dispatch(setLoading(false));
      setError(error.response.data.message);
      if (error.response.status === 401) {
        dispatch(signOutUser());
        navigate("/signin");
      }
    }
  };

  return (
    <div className="container max-w-screen-2xl ">
      <div className="my-8 p-10 bg-white rounded-xl shadow-md custom-min-h-screen">
        <Heading title="Profile" cssClass="mb-8" />
        <div className="mx-auto max-w-[540px]">
          {uploadError && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      onChange={handleImageUpload}
                      id="picture"
                      type="file"
                      accept="image/png, image/jpeg"
                      ref={profileImageRef}
                      className="hidden"
                    />
                    <Avatar {...field} className="w-28 h-28 mx-auto mb-5 p-1 rounded-full overflow-visible shadow-md">
                      {uploadProgress !== null && uploadProgress <= 100 && (
                        <CircularProgressbar
                          className="absolute"
                          value={uploadProgress}
                          text={`${uploadProgress}%`}
                          strokeWidth={4}
                          styles={{
                            root: {
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: "1px",
                              left: "0px",
                            },
                            trail: {
                              stroke: "#d6d6d6",
                            },
                            path: {
                              stroke: `rgba(240, 68, 68, ${uploadProgress / 100})`,
                              strokeLinecap: "butt",
                              background: "transparent",
                            },
                            text: {
                              fontSize: "16px",
                              fontWeight: "bold",
                              fill: "rgb(240, 68, 68)",
                              position: "absolute",
                            },
                          }}
                        />
                      )}
                      <AvatarImage
                        className="rounded-full"
                        src={(imageFileUrl && imageFileUrl) || currentUser?.profileImage}
                        alt="Username"
                      />
                      <LucideImage
                        onClick={() => profileImageRef.current?.click()}
                        size={32}
                        className="absolute shadow-md bottom-0 right-2 rounded-full p-2 text-white bg-gradient-to-r from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500 cursor-pointer"
                      />
                    </Avatar>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Email address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={uploadProgress !== null && uploadProgress < 100}
                className="w-full bg-gradient-to-r from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
              >
                {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Update Profile"}
              </Button>
            </form>
          </Form>
          <div className="flex items-center gap-5 mt-5">
            <Dialog>
              <DialogTrigger
                type="button"
                className="w-full text-white px-4 py-2 h-10 text-sm rounded-md bg-slate-800 hover:bg-slate-700 transition-all duration-500"
              >
                Delete Account
              </DialogTrigger>
              <Button
                onClick={() => (dispatch(signOutUser()), navigate("/signin"))}
                type="button"
                className="w-full bg-slate-800 hover:bg-slate-700 transition-all duration-500"
              >
                Sign Out
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-2">Are you sure want to delete this accont?</DialogTitle>
                  <DialogDescription className="mb-5">
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                  <Button
                    type="button"
                    onClick={() => handleDeleteAccount()}
                    className="bg-gradient-to-r from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
                  >
                    Yes. Confirm
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
