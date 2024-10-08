import React, { useEffect, useState , useCallback} from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../services/api';
import AgentSearch from './AgentSearch';
import TeamStats from './TeamStats';
import AgentDetails from './AgentDetails'; // Import the AgentDetails component
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Green tick for available
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';  // Grey cross for offline
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Red circle for busy

const TeamPerformance = () => {
  const [teamData, setTeamData] = useState([]);
  const [searchedAgent, setSearchedAgent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchId, setSearchId] = useState('');
  const [, setResetSearch] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null); // State to hold the selected agent ID

  const fetchTeamData = useCallback( async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/agents', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        params: {
          availabilityStatus: filterStatus === 'all' ? undefined : filterStatus,
          categoryName: filterCategory === 'all' ? undefined : filterCategory,
        },
      });
      setTeamData(response.data);
    } catch (error) {
      console.error('Error fetching agent data:', error);
    }
  },[filterStatus,filterCategory]);

  useEffect(() => {
    fetchTeamData();
  }, [filterStatus, filterCategory,fetchTeamData]);

  const clearSearchAndFilter = () => {
    setSearchedAgent(null);
    setFilterStatus('all');
    setFilterCategory('all');
    setSearchId('');
    setResetSearch(true);
    setSelectedAgentId(null);
    setTimeout(() => setResetSearch(false), 0);
    fetchTeamData();
  };

  const getAvailabilityIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircleIcon sx={{ color: 'green', fontSize: '20px' }} />;
      case 'busy':
        return <FiberManualRecordIcon sx={{ color: 'red', fontSize: '20px' }} />;
      case 'offline':
        return <RemoveCircleIcon sx={{ color: 'grey', fontSize: '20px' }} />;
      default:
        return <FiberManualRecordIcon sx={{ color: 'grey', fontSize: '20px' }} />; // Empty grey circle
    }
  };

  const handleAgentSelect = (agentId) => {
    setSelectedAgentId(agentId); // Set the selected agent ID
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#FFFFFF' }}>
      <Grid container sx={{ flex: 1, height: '100%' }}>
        {/* Left Side - Search and Filters */}
        <Grid item xs={12} md={4} sx={{ borderRight: '1px solid #DDDDDD', padding: '20px', overflowY: 'auto' }}>
          {/* Search with Clear Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <AgentSearch setSearchedAgent={setSearchedAgent} searchId={searchId} setSearchId={setSearchId} />
            <IconButton
              onClick={clearSearchAndFilter}
              sx={{
                marginLeft: '8px',
                backgroundColor: '#F0F0F0',
                '&:hover': { backgroundColor: '#E0E0E0' },
              }}
            >
              <RefreshIcon sx={{ color: '#333333' }} />
            </IconButton>
          </Box>

          {/* Filters */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Availability Status</InputLabel>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="busy">Busy</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="billing">Billing</MenuItem>
                  <MenuItem value="support">Support</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Agent List */}
          <Box sx={{ maxHeight: '70vh', overflowY: 'auto', marginTop: '20px' }}>
            {searchedAgent ? (
              <Card sx={{ padding: '20px', marginBottom: '20px' }}>
                <CardContent>
                  <Typography variant="h6">Searched Agent:</Typography>
                  <Typography variant="body1"><strong>Agent ID:</strong> {searchedAgent.agentId}</Typography>
                  {getAvailabilityIcon(searchedAgent.availabilityStatus)}
                </CardContent>
              </Card>
            ) : (
              teamData.map((agent) => (
                <Card
                  key={agent.agentId}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginBottom: '10px' }}
                  onClick={() => handleAgentSelect(agent.agentId)} // Set selected agent on click
                >
                  <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ marginRight: '10px' }}>Agent ID: {agent.agentId}</Typography>
                    {getAvailabilityIcon(agent.availabilityStatus)}
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Grid>

        {/* Right Side - Agent Details or Team Stats */}
        <Grid item xs={12} md={8} sx={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
          {/* Render AgentDetails if an agent is selected, otherwise render TeamStats */}
          {selectedAgentId ? (
            <AgentDetails agentId={selectedAgentId} />
          ) : (
            <TeamStats />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamPerformance;
