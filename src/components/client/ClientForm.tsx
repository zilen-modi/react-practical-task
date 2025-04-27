import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ClientRecord } from '../../types';
import { useClientContext } from '../../contexts/ClientContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type FormMode = 'add' | 'edit';

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  mode: FormMode;
  initialData?: ClientRecord;
}

const createFormSchema = (
  checkEmailUnique: (email: string, currentId?: string) => boolean,
  currentId?: string
) => {
  return z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email format' })
      .refine(email => checkEmailUnique(email, currentId), {
        message: 'Email already exists',
      }),
    phone: z.string().optional(),
    company: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
  });
};

type FormSchemaType = z.infer<ReturnType<typeof createFormSchema>>;

export const ClientForm = ({ open, onClose, mode, initialData }: ClientFormProps) => {
  const { addRecord, updateRecord, checkEmailUnique } = useClientContext();

  const formSchema = createFormSchema(checkEmailUnique, initialData?.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData && mode === 'edit') {
        reset({
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone || '',
          address: initialData.address || '',
          company: initialData.company || '',
          notes: initialData.notes || '',
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          address: '',
          company: '',
          notes: '',
        });
      }
    }
  }, [initialData, mode, open, reset]);

  const onSubmit = (data: FormSchemaType) => {
    if (mode === 'add') {
      addRecord(data);
    } else if (mode === 'edit' && initialData) {
      updateRecord(initialData.id, data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {mode === 'add' ? 'Add New Client' : 'Edit Client'}
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <TextField {...field} label="Phone" fullWidth />}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="company"
                control={control}
                render={({ field }) => <TextField {...field} label="Company" fullWidth />}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <TextField {...field} label="Address" fullWidth />}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Notes" fullWidth multiline rows={3} />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            sx={{
              minWidth: '100px',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              minWidth: '100px',
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            {mode === 'add' ? 'Add Client' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
