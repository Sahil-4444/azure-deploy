import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
} from '@mui/material';
import api from '../services/api';

const ClosedTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const agentId = localStorage.getItem('id'); // Get the agent's ID

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get(`/agent/${agentId}/closed-tickets`);

        if (response.data.length === 0) {
          setError('No tickets closed by this agent.');
        } else {
          setTickets(response.data);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Error loading closed tickets. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [agentId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2}}>
      <Table>
        <TableHead>
          <TableRow>
            {['Ticket ID', 'Customer Email', 'Category', 'Status', 'Priority', 'Subject', 'Created At'].map((header) => (
              <TableCell key={header}>
                <TableSortLabel>{header}</TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.ticketId} sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
              <TableCell>{ticket.ticketId}</TableCell>
              <TableCell>{ticket.customerEmail}</TableCell>
              <TableCell>{ticket.categoryName}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>{ticket.priority}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClosedTickets;
