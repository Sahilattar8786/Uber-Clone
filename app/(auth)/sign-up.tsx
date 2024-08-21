


import InputField from "@/components/InputField";
import { images,icons } from "@/constant";
import { Alert, Image, Text,View } from "react-native";
import { ScrollView } from "react-native";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";

const SignUp=()=>{
   const { isLoaded, signUp, setActive } = useSignUp()
   const [modalVisible, setModalVisible] = useState(false);
   const [form ,setForm]=useState({
      name:'',
      email:'',
      password:''
   })
   const [verification,setVerification]=useState({
      state:'default',
      error:'',
      code:''
   })
   const onSignUpPress = async () => {
      if (!isLoaded) {
        return
      }
  
      try {
        await signUp.create({
          emailAddress:form.email,
          password:form.password,
        })
  
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
  
        setVerification({
         ...verification,
          state:'pending',
        })
      } catch (err: any) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
        Alert.alert("Error", err.errors[0].longMessage);
      }
    }
    const onPressVerify = async () => {
      if (!isLoaded) {
        return
      }
  
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code:verification.code
        })
  
        if (completeSignUp.status === 'complete') {
          // create a database user 
          await fetchAPI('/(api)/user',{
            method: "POST",
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              clerkId: completeSignUp.createdUserId,
            }),
          })
          await setActive({ session: completeSignUp.createdSessionId })
          setVerification({
            ...verification,
            state:'success',
            error:''
          })
        } else {
          setVerification({
            ...verification,
            state:'failed',
            error:'Verification failed'
          })
          console.error(JSON.stringify(completeSignUp, null, 2))
        }
      } catch (err: any) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
        setVerification({
         ...verification,
          state:'failed',
          error:err.errors[0].longMessage 
        })
      }
    }
  return(
     <ScrollView className="flex-1 bg-white ">
       <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
              <Image 
               source={images.signUpCar}
                className="z-0 w-full h-[250px]"
                />
                <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                     Create Your Account 
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
               <CustomButton  title="Sign Up" onPress={onSignUpPress} className="mt-6"/>
               {/* OAuth */}
                <OAuth/>

               <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
                 <Text>Already Have An Account ?  </Text>
                 <Text className="text-primary-500">Sign In</Text>
               </Link>
           </View>
          <View>
             
          </View>
          {/* Verification Start */}
          <ReactNativeModal 
          isVisible={verification.state==='pending'}
          onModalHide={()=>{
            if(verification.state==='success') setModalVisible(true)
          }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="text-2xl font-JakartaBold mb-2">Verification</Text>
              <Text>
                 We've sent a verification code to {form.email}
              </Text>
               <InputField 
               label="Verification Code"
               placeholder="Enter Your Verification Code"
               icon={icons.lock}
               value={verification.code}
               keyboardType="numeric"
               onChangeText={(text)=>setVerification({...verification,code:text})}
              />
                {
                  verification.error && (
                    <Text className="text-sm mt-1 text-red-500  ">
                     {verification.error}
                    </Text>
                  )
                }
                <CustomButton title="Verify Email" 
                onPress={onPressVerify} 
                className="mt-5 bg-success-500"
                />
            </View>

          </ReactNativeModal>
          {/* Verification */}
          <ReactNativeModal isVisible={modalVisible}>
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Image
                 source={images.check} 
                  className="w-[110px] h-[110px] mx-auto my-5"
                 />
                 <Text className="text-3xl font-JakartaBold text-center" >
                   Verified
                 </Text>
                 <Text className="text-base text-gray-400 font-Jakarta text-center  mt-2">
                     You Have Successfully verified your account  
                 </Text>

                 <CustomButton 
                  title="Continue"
                  onPress={()=>{
                    setModalVisible(false)
                    router.push("/(route)/(tabs)/home")
                  }}
                 />

              </View>
          </ReactNativeModal>

       </View>

     </ScrollView>
  )
}

export default SignUp ;
