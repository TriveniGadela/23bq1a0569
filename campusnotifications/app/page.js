"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Button,
  Select, MenuItem, FormControl, InputLabel,
  Chip, Card, CardContent, Grid,
  Tabs, Tab, CircularProgress
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";

const PRIORITY = { "Placement": 3, "Result": 2, "Event": 1 };

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [filterType, setFilterType] = useState("All");
  const [topN, setTopN] = useState(10);
  const [viewed, setViewed] = useState([]);

  async function fetchNotifications() {
    setLoading(true);
    try {
      let url = "/api/notifications"; // ✅ now using your backend route
      if (filterType !== "All") url += `?notification_type=${filterType}`;

      const res = await fetch(url);
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchNotifications();
  }, [filterType]);

  function markViewed(id) {
    if (!viewed.includes(id)) setViewed([...viewed, id]);
  }

  const priorityNotifications = [...notifications]
    .sort((a, b) => {
      const pa = PRIORITY[a.Type] || 0;
      const pb = PRIORITY[b.Type] || 0;
      if (pb !== pa) return pb - pa;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, topN);

  const typeColor = {
    Placement: "error",
    Result: "warning",
    Event: "info",
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <NotificationsIcon fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight="bold">
          Campus Notifications
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="All Notifications" />
        <Tab label="⭐ Priority Inbox" />
      </Tabs>

      {/* All Notifications Tab */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter Type</InputLabel>
              <Select
                value={filterType}
                label="Filter Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={fetchNotifications}>
              Refresh
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {notifications.map((n) => (
                <Grid item xs={12} md={6} key={n.ID}>
                  <Card
                    onClick={() => markViewed(n.ID)}
                    sx={{
                      cursor: "pointer",
                      border: viewed.includes(n.ID)
                        ? "1px solid #ccc"
                        : "2px solid #1976d2",
                      opacity: viewed.includes(n.ID) ? 0.7 : 1,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={n.Type}
                          color={typeColor[n.Type]}
                          size="small"
                        />
                        {!viewed.includes(n.ID) && (
                          <Chip label="NEW" color="success" size="small" />
                        )}
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {n.Message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        🕒 {new Date(n.Timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Priority Inbox Tab */}
      {tab === 1 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Show Top</InputLabel>
              <Select
                value={topN}
                label="Show Top"
                onChange={(e) => setTopN(e.target.value)}
              >
                <MenuItem value={10}>Top 10</MenuItem>
                <MenuItem value={15}>Top 15</MenuItem>
                <MenuItem value={20}>Top 20</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {priorityNotifications.map((n, index) => (
                <Grid item xs={12} md={6} key={n.ID}>
                  <Card
                    onClick={() => markViewed(n.ID)}
                    sx={{
                      cursor: "pointer",
                      border: viewed.includes(n.ID)
                        ? "1px solid #ccc"
                        : "2px solid #1976d2",
                      opacity: viewed.includes(n.ID) ? 0.7 : 1,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={n.Type}
                          color={typeColor[n.Type]}
                          size="small"
                        />
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {!viewed.includes(n.ID) && (
                            <Chip label="NEW" color="success" size="small" />
                          )}
                          <Chip
                            icon={<StarIcon />}
                            label={`#${index + 1}`}
                            color="primary"
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {n.Message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        🕒 {new Date(n.Timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
}
