import { BodyText, ButtonAuth, Input, Logo } from '@/components/ui/atoms';
import { FormData, schema } from '@/features/login/schema/schemaLogin';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <View className="flex-1 px-6">
              <View className="flex-1 justify-center items-center">
                <Logo />

                <BodyText text="Welcome" variant="title" />

                <BodyText
                  text="Securely access your health records."
                  variant="subtitle"
                />
              </View>

              <View className="w-full">
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      label="Email Address"
                      placeholder="name@example.com"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      icon={
                        <MaterialIcons name="mail" size={24} color="#9ca3af" />
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      label="Password"
                      placeholder="••••••••"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={errors.password?.message}
                      secureTextEntry={true}
                      icon={
                        <MaterialIcons name="lock" size={24} color="#9ca3af" />
                      }
                    />
                  )}
                />
              </View>

              <View className="flex-1 justify-end pb-8">
                <View className="mt-8">
                  <ButtonAuth title="Login" onPress={handleSubmit(onSubmit)} />
                </View>

                <View className="flex-row justify-center mt-8">
                  <Text className="text-[#6b7280] text-base">
                    Don't have an account?{' '}
                  </Text>
                  <Link href="/auth/register" asChild>
                    <Pressable>
                      <Text className="text-[#5cc8c8] text-base font-semibold">
                        Register
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;
