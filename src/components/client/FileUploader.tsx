import { useRef, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { useClientContext } from '../../contexts/ClientContext';
import { parseJSON, mergeRecords } from '../../utils/recordUtils';
import { ClientRecord } from '../../types';

export const FileUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { records, uploadJSON } = useClientContext();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ record: ClientRecord; errors: string[] }[]>([]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    setValidationErrors([]);

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const parseResult = parseJSON(fileContent);
      if (parseResult.errors.length > 0) {
        // Coerce unknown records into ClientRecord for the state setter
        const formattedErrors = parseResult.errors.map(({ record, errors }) => ({
          record: record as ClientRecord,
          errors,
        }));
        setValidationErrors(formattedErrors);
        return;
      }

      if (parseResult.records.length === 0) {
        setError('No valid records found in the file');
        return;
      }

      const mergeResult = mergeRecords(records, parseResult.records);
      uploadJSON(JSON.stringify(mergeResult.records));

      const message = mergeResult.mergedCount > 0
        ? `Successfully uploaded ${parseResult.records.length} records (${mergeResult.mergedCount} merged with existing records)`
        : `Successfully uploaded ${parseResult.records.length} new records`;
      
      setSuccess(message);
    } catch {
      setError('Failed to process the file. Please ensure it is a valid JSON file.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Upload Client Records
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Upload a JSON file containing client records. Records with duplicate emails will be merged automatically.
        </Typography>
        
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Upload JSON File
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={handleUpload}
          />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {validationErrors.length > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Some records could not be processed due to validation errors:
          </Typography>
          <List dense sx={{ mt: 1, mb: 0 }}>
            {validationErrors.map((error, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemText
                  primary={`Record ${error.record ? `(${error.record.email || 'Unknown'})` : ''}`}
                  secondary={error.errors.join(', ')}
                />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Paper>
  );
}; 