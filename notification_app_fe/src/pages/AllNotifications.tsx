import { useState, useEffect } from 'react';
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, Pagination, CircularProgress, Button } from '@mui/material';
import { fetchNotifications, NotificationItem } from '../api/notificationService';
import { NotificationCard } from '../components/NotificationCard';
import { useReadState } from '../hooks/useReadState';

export const AllNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('All');
  const [total, setTotal] = useState(0);
  const limit = 10;
  
  const { readIds, markAsRead, markAllAsRead } = useReadState();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchNotifications(page, limit, type);
      setNotifications(res.notifications);
      setTotal(res.total);
      setLoading(false);
    };
    load();
  }, [page, type]);

  const handleMarkAll = () => {
    markAllAsRead(notifications.map(n => n.ID));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          All Notifications
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button variant="outlined" onClick={handleMarkAll} size="small">Mark All as Read</Button>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter Type</InputLabel>
            <Select
              value={type}
              label="Filter Type"
              onChange={(e) => {
                setType(e.target.value as string);
                setPage(1);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {notifications.length === 0 ? (
            <Typography variant="body1" textAlign="center" py={4}>No notifications found.</Typography>
          ) : (
            notifications.map(n => (
              <NotificationCard 
                key={n.ID} 
                notification={n} 
                isRead={readIds.has(n.ID)}
                onClick={() => markAsRead(n.ID)}
              />
            ))
          )}
          
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination 
              count={Math.ceil(total / limit)} 
              page={page} 
              onChange={(_, p) => setPage(p)} 
              color="primary" 
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};
