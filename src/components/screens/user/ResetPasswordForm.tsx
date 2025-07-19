import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card,Text, TextInput, useTheme } from 'react-native-paper';
import { Tabs, TabScreen, TabsProvider, useTabNavigation } from 'react-native-paper-tabs';
import { z } from 'zod';

// Define validation schema using zod
const resetPasswordSchema = z.object({
  email: z.email('Please enter a valid email'),
});

const newPasswordSchema = z.object({
  code: z.string().min(1, 'Verification code is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

interface ResetPasswordFormProps {
  onSubmitEmail?: (data: ResetPasswordFormData) => void;
  onSubmitNewPassword?: (data: NewPasswordFormData) => void;
  onBackToLogin?: () => void;
}

export function ResetPasswordForm({
  onSubmitEmail,
  onSubmitNewPassword,
  onBackToLogin
}: ResetPasswordFormProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Email form
  const { 
    control: emailControl, 
    handleSubmit: handleEmailSubmit, 
    formState: { errors: emailErrors } 
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  // New password form
  const { 
    control: passwordControl, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors } 
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmitEmailForm = (data: ResetPasswordFormData) => {
    console.log('Reset password email submitted:', data);
    if (onSubmitEmail) {
      onSubmitEmail(data);
    }
  };

  const onSubmitNewPasswordForm = (data: NewPasswordFormData) => {
    console.log('New password submitted:', data);
    if (onSubmitNewPassword) {
      onSubmitNewPassword(data);
    }
  };

  const RequestCodeForm = () => {
    const goTo = useTabNavigation();
    
    return (
      <Card style={styles.formCard} elevation={2}>
        <Card.Content style={styles.form}>
          <Text variant="bodyMedium" style={styles.instructions}>
            Enter your email address and we&apos;ll send you a verification code to reset your password.
          </Text>
          
          <Controller
            control={emailControl}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  error={!!emailErrors.email}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                />
                {emailErrors.email && (
                  <Text style={styles.errorText}>{emailErrors.email.message}</Text>
                )}
              </View>
            )}
          />

          <Button 
            mode="contained" 
            onPress={handleEmailSubmit((data) => {
              onSubmitEmailForm(data);
              goTo(1); // Navigate to the next tab
            })}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Send Reset Code
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const ResetPasswordWithCodeForm = () => {
    const goTo = useTabNavigation();
    
    return (
      <Card style={styles.formCard} elevation={2}>
        <Card.Content style={styles.form}>
          <Text variant="bodyMedium" style={styles.instructions}>
            Enter the verification code sent to your email and create a new password.
          </Text>
          
          <Controller
            control={passwordControl}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Verification Code"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  error={!!passwordErrors.code}
                  mode="outlined"
                  left={<TextInput.Icon icon="key" />}
                />
                {passwordErrors.code && (
                  <Text style={styles.errorText}>{passwordErrors.code.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={passwordControl}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="New Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  error={!!passwordErrors.password}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {passwordErrors.password && (
                  <Text style={styles.errorText}>{passwordErrors.password.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={passwordControl}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirm New Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  error={!!passwordErrors.confirmPassword}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />
                {passwordErrors.confirmPassword && (
                  <Text style={styles.errorText}>{passwordErrors.confirmPassword.message}</Text>
                )}
              </View>
            )}
          />

          <Button 
            mode="contained" 
            onPress={handlePasswordSubmit(onSubmitNewPasswordForm)} 
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Reset Password
          </Button>
          
          <Button 
            mode="text" 
            onPress={() => goTo(0)} 
            style={styles.textButton}
          >
            Back to Email Form
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>Reset Password</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Follow the steps to reset your password
          </Text>
        </View>

        <TabsProvider defaultIndex={0}>
          <Tabs mode="fixed" showLeadingSpace={true}>
            <TabScreen label="Request Code" icon="email-send">
              <View style={styles.tabContent}>
                <RequestCodeForm />
              </View>
            </TabScreen>
            <TabScreen label="Reset Password" icon="lock-reset">
              <View style={styles.tabContent}>
                <ResetPasswordWithCodeForm />
              </View>
            </TabScreen>
          </Tabs>
        </TabsProvider>
        
        <Button 
          mode="text" 
          onPress={onBackToLogin} 
          style={styles.backButton}
        >
          Back to Login
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  content: {
    padding: 2,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  tabContent: {
    paddingTop: 16,
  },
  formCard: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  form: {
    padding: 24,
  },
  instructions: {
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    marginTop: 4,
    marginLeft: 16,
    fontSize: 12,
    color: '#d32f2f',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 24,
    alignSelf: 'center',
  }
});
