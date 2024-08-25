/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label, TextInput, Toast } from "flowbite-react";
import { FC, useEffect } from "react";
import { login } from "../../services/apiAuthentication";
import { toast } from "react-toastify";
import { isLogin } from "../../utils/axios";
import { useNavigate } from "react-router";
const SignInPage: FC = function () {
  const navigate = useNavigate();
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget; // currentTarget is strongly typed as HTMLFormElement
    const email = form["email"].value;
    const password = form["password"].value;
    const credentials = { username: email, password: password };
    try {
      await login(credentials);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(
        "Can not login, please check your credentials and try again!"
      );
    }
  };

  useEffect(() => {
    if (isLogin()) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <a href="/" className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-10"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          G5Tech store
        </span>
      </a>
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt=""
        className="w-full md:max-w-[1024px] md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Sign in to administration
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Your email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
            />
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto">
              Login to your account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
