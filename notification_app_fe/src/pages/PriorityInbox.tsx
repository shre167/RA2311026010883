import { useState, useEffect } from 'react';
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { fetchNotifications, NotificationItem } from '../api/notificationService';
import { NotificationCard } from '../components/NotificationCard';
import { useReadState } from '../hooks/useReadState';

const WEIGHTS: Record<string, number> = { "Placement": 3, "Result": 2, "Event": 1 };

export const PriorityInbox = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);
  const [type, setType] = useState('All');
  
  const { readIds, markAsRead } = useReadState();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Fetch a larger set to sort and find top N priority unread
      const res = await fetchNotifications(1, 100, type === 'All' ? undefined : type); 
      
      const unread = res.notifications.filter(n => !readIds.has(n.ID));
      
      // Sort by priority logic (Weight then Recency)
      const sorted = unread.sort((a, b) => {
        const weightA = WEIGHTS[a.Type] || 0;
        const weightB = WEIGHTS[b.Type] || 0;
        if (weightA !== weightB) return weightB - weightA; // Higher weight first
        
        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(); // Newer first
      });

      setNotifications(sorted.slice(0, topN));
      setLoading(false);
    };
    load();
  }, [topN, type, readIds]); // Re-evaluate when unread state changes

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary.dark">
          Priority Inbox
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter Type</InputLabel>
            <Select
              value={type}
              label="Filter Type"
              onChange={(e) => setType(e.target.value as string)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Top N</InputLabel>
            <Select
              value={topN}
              label="Top N"
              onChange={(e) => setTopN(Number(e.target.value))}
            >
              <MenuItem value={5}>Top 5</MenuItem>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Displaying the most important unread notifications based on priority rules.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {notifications.length === 0 ? (
            <Box textAlign="center" py={8} bgcolor="grey.50" borderRadius={2}>
              <Typography variant="h6" color="text.secondary">All caught up!</Typography>
              <Typography variant="body2" color="text.secondary">No unread priority notifications left.</Typography>
            </Box>
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
        </Box>
      )}
    </Container>
  );
};
