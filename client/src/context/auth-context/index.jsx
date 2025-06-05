import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";

import { createContext, useEffect, useState } from "react";
//import { toast } from "sonner";

export const AuthContext = createContext(null);
export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    toast({
    title: "register successful",
    duration: 4000,
  })


    const data = await registerService(signUpFormData);

    event.preventDefault();
    


  }

  async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginService(signInFormData);

    if (data.success) {
toast({
    title: "Login successful",
    description: `Welcome, ${data.data.user.name || data.data.user.userEmail}`,
    variant: "success",
    className: "bg-green-500 text-white",
    duration: 4000,
  });
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,

        user: null,
      });
    }
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {


        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {


      console.log(error);
      if (!error?.response?.data?.success) {

        setAuth({
          authenticate: false,
          user: null,
        });
                             
        setLoading(false);
        
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
