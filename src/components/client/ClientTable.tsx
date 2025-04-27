import { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ClientRecord } from '../../types';
import { useClientContext } from '../../contexts/ClientContext';

interface ClientTableProps {
  onEditRecord: (record: ClientRecord) => void;
}

export const ClientTable = ({ onEditRecord }: ClientTableProps) => {
  const theme = useTheme();
  const {
    filteredRecords,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setSearchTerm,
    deleteRecord,
    sortConfig,
    setSortConfig,
  } = useClientContext();

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [page, setPage] = useState(currentPage - 1);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    recordId: string | null;
  }>({
    open: false,
    recordId: null,
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
      setPage(0);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localSearchTerm, setSearchTerm, setCurrentPage]);

  const handleDeleteClick = (recordId: string) => {
    setDeleteConfirmation({ open: true, recordId });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.recordId) {
      deleteRecord(deleteConfirmation.recordId);
    }
    setDeleteConfirmation({ open: false, recordId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ open: false, recordId: null });
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            backgroundColor: theme.palette.primary.main,
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.875rem',
          }}
        >
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,
      renderCell: params => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 220,
      renderCell: params => (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textDecoration: 'none',
            '&:hover': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
            },
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            opacity: 0.7,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <IconButton size="small" onClick={() => onEditRecord(params.row as ClientRecord)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setCurrentPage(newPage + 1);
  };

  const handleSortModelChange = (field: string, direction: 'asc' | 'desc') => {
    if (field) {
      setSortConfig({
        key: field as keyof ClientRecord,
        direction: direction,
      });
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          width: '100%',
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Client Records
          </Typography>
          <TextField
            placeholder="Search by ID, Name, or Email"
            size="small"
            value={localSearchTerm}
            onChange={e => setLocalSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>

        <DataGrid
          rows={filteredRecords}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: pageSize,
                page: page,
              },
            },
            sorting: {
              sortModel: [{ field: sortConfig.key, sort: sortConfig.direction }],
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationMode="client"
          pagination
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={model => {
            handlePageChange(model.page);
            setPageSize(model.pageSize);
          }}
          sortingMode="client"
          onSortModelChange={model => {
            if (model.length > 0) {
              handleSortModelChange(model[0].field, model[0].sort as 'asc' | 'desc');
            }
          }}
          disableRowSelectionOnClick
          getRowId={row => row.id}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.palette.divider,
              display: 'flex',
              alignItems: 'center',
              '&:focus': {
                outline: 'none',
              },
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: theme.palette.background.default,
              '&:focus': {
                outline: 'none',
              },
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: theme.palette.background.paper,
            },
            '& .MuiDataGrid-main': {
              overflow: 'unset',
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            mt: 2,
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.background.default,
              padding: '4px 12px',
              borderRadius: '8px',
            }}
          >
            Total: {filteredRecords.length} records
          </Typography>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '400px',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography>
            Are you sure you want to delete this client record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '100px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '100px',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
