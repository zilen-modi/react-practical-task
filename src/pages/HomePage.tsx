import { useState } from 'react';
import { Box, Button, Grid, Fab, useMediaQuery, Theme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ClientTable } from '../components/client/ClientTable';
import { FileUploader } from '../components/client/FileUploader';
import { ClientForm } from '../components/client/ClientForm';
import { ClientRecord } from '../types';

export const HomePage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedRecord, setSelectedRecord] = useState<ClientRecord | undefined>(undefined);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleAddClient = () => {
    setFormMode('add');
    setSelectedRecord(undefined);
    setFormOpen(true);
  };

  const handleEditClient = (record: ClientRecord) => {
    setFormMode('edit');
    setSelectedRecord(record);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <FileUploader />
        </Grid>
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {!isMobile && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddClient}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Add Client
              </Button>
            )}
          </Box>
          <ClientTable onEditRecord={handleEditClient} />
        </Grid>
      </Grid>

      {/* Floating action button for mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddClient}
        >
          <AddIcon />
        </Fab>
      )}

      <ClientForm
        open={formOpen}
        onClose={handleCloseForm}
        mode={formMode}
        initialData={selectedRecord}
      />
    </Box>
  );
};
