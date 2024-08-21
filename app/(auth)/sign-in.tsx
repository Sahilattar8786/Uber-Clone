


import InputField from "@/components/InputField";
import { images,icons } from "@/constant";
import { Image, Text,View } from "react-native";
import { ScrollView } from "react-native";
import { useState,useCallback } from "react";
import CustomButton from "@/components/CustomButton";
import { Link,router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";


const SignIn=()=>{
   const {signIn,setActive,isLoaded}=useSignIn();
   

   const [form ,setForm]=useState({
      name:'',
      email:'',
      password:''
   })

   const onSignInPress = useCallback(async () => {
      if (!isLoaded) {
        return
      }
  
      try {
        const signInAttempt = await signIn.create({
          identifier: form.email,
          password:form.password,
        })
  
        if (signInAttempt.status === 'complete') {
          await setActive({ session: signInAttempt.createdSessionId })
          router.replace("/(route)/(tabs)/home")
        } else {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(signInAttempt, null, 2))
        }
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2))
      }
    }, [isLoaded,form])
  return(
     <ScrollView className="flex-1 bg-white ">
       <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
              <Image 
               source={images.signUpCar}
                className="z-0 w-full h-[250px]"
                />
                <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                     Welcome
                </Text>
          </View>
          {/* Your Sign Up Form Here */}
           <View className="p-5">
              <InputField 
               label="Name"
               placeholder="Enter Your Name"
               icon={icons.person}
               value={form.name}
               onChangeText={(text)=>setForm({...form,name:text})}
              />     
              <InputField 
               label="Email"
               placeholder="Enter Your Email"
               icon={icons.email}
               value={form.email}
               onChangeText={(text)=>setForm({...form,email:text})}
              />
              <InputField 
               label="Password"
               placeholder="Enter Your Password"
               icon={icons.lock}
               secureTextEntry={true}
               value={form.password}
               onChangeText={(text)=>setForm({...form,password:text})}
              />
               <CustomButton  title="Sign Up" onPress={onSignInPress} className="mt-6"/>
               {/* OAuth */}
                <OAuth/>

               <Link href="/sign-up" className="text-lg text-center text-general-200 mt-10">
                 <Text>Don't have an account  </Text>
                 <Text className="text-primary-500">Sign Up</Text>
               </Link>
           </View>
          <View>
             
          </View>
       </View>

     </ScrollView>
  )
}

export default SignIn ;
