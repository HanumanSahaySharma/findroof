import { z } from "zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "@/store/loading/loadingSlice";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import OAuth from "@/components/OAuth";
import { signInUser } from "@/store/user/userSlice";

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email address.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: any) => state.loading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post("/api/auth/signin", values);
      if (res.status === 200) {
        toast.success(res.data.message);
        dispatch(setLoading(false));
        dispatch(signInUser(res.data.user));
        // navigate("/signin");
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container max-w-screen-2xl ">
      <div className="my-5 max-w-[620px] mx-auto p-10 bg-white rounded-xl shadow-xl">
        <h1 className="font-bold text-3xl mb-8">
          <span className="bg-gradient-to-r from-pink-400 via-red-500 to-orange-500 text-transparent bg-clip-text">
            Sign In
          </span>
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800">Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white border h-[42px] border-slate-300"
                    />
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
                    <Input
                      type="password"
                      {...field}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white border h-[42px] border-slate-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
            >
              {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
        <p className="text-sm text-center text-slate-500 py-4">OR</p>
        <OAuth label="Sign In with Google" />
        <p className="text-sm font-medium text-center">
          Dod't have any account?{" "}
          <Link to="/signup" className="text-red-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
