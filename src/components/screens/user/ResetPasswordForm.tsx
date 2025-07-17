import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput, useTheme } from 'react-native-paper';
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
  const [step, setStep] =useState<'email' | 'newPassword'>('email');
  
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
    setStep('newPassword');
  };

  const onSubmitNewPasswordForm = (data: NewPasswordFormData) => {
    console.log('New password submitted:', data);
    if (onSubmitNewPassword) {
      onSubmitNewPassword(data);
    }
  };

  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {step === 'email' ? 'Reset Password' : 'Create New Password'}
      </Text>
      
      {step === 'email' ? (
        <View style={styles.form}>
          <Text style={styles.instructions}>
            Enter your email address and we&apos;ll send you a verification code to reset your password.
          </Text>
          
          <Controller
            control={emailControl}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
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
              />
            )}
          />
          {emailErrors.email && (
            <Text style={{ color: theme.colors.error }}>{emailErrors.email.message}</Text>
          )}

          <Button 
            mode="contained" 
            onPress={handleEmailSubmit(onSubmitEmailForm)} 
            style={styles.button}
          >
            Send Reset Code
          </Button>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.instructions}>
            Enter the verification code sent to your email and create a new password.
          </Text>
          
          <Controller
            control={passwordControl}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Verification Code"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.input}
                error={!!passwordErrors.code}
                mode="outlined"
              />
            )}
          />
          {passwordErrors.code && (
            <Text style={{ color: theme.colors.error }}>{passwordErrors.code.message}</Text>
          )}

          <Controller
            control={passwordControl}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="New Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.input}
                error={!!passwordErrors.password}
                mode="outlined"
                secureTextEntry
              />
            )}
          />
          {passwordErrors.password && (
            <Text style={{ color: theme.colors.error }}>{passwordErrors.password.message}</Text>
          )}

          <Controller
            control={passwordControl}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirm New Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.input}
                error={!!passwordErrors.confirmPassword}
                mode="outlined"
                secureTextEntry
              />
            )}
          />
          {passwordErrors.confirmPassword && (
            <Text style={{ color: theme.colors.error }}>{passwordErrors.confirmPassword.message}</Text>
          )}

          <Button 
            mode="contained" 
            onPress={handlePasswordSubmit(onSubmitNewPasswordForm)} 
            style={styles.button}
          >
            Reset Password
          </Button>
          
          <Button 
            mode="text" 
            onPress={() => setStep('email')} 
            style={styles.textButton}
          >
            Back to Email Form
          </Button>
        </View>
      )}
      
      <Button 
        mode="text" 
        onPress={onBackToLogin} 
        style={styles.textButton}
      >
        Back to Login
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  textButton: {
    marginTop: 16,
  }
});
