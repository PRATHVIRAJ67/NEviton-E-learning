const express = require('express');
const cors = require('cors');
const Mux = require('@mux/mux-node');

const app = express();
const PORT = process.env.PORT || 3001;


const MUX_TOKEN_ID = '0e8ce266-ebd9-46bb-b73a-933f162573cd';
const MUX_TOKEN_SECRET = 'IPqK1dCAiH6ZcaAhNOHpWAEhr9sxscRCCdZ5G4u4BO/H0EgUOjHAi0IrkhZ4r3w+soywnExuxVK';


const { Video } = new Mux({
  tokenId: MUX_TOKEN_ID,
  tokenSecret: MUX_TOKEN_SECRET
});


app.use(cors());
app.use(express.json());


const videos = [
      {
    id: 1,
    title: "Machine Learning Master CLass",
    description: "Master U r Machine Learning  Skills",
   
    muxAssetId: "00dgMbWKgQ2bl7bwsq8kWjahuuro00jLBdyPEhqx9RoIQ",
    muxPlaybackId: "e1r2DkQmT5CXaEMfEBw0067OuxXQKYBssM7xWtP1D4wM"
  },

   {
    id: 2,
    title: "Mern Stack BootCamp",
    description: "Master Your App Developemnt SKills",
   
    muxAssetId: "NFm02u8x3wFamtU4G73KQJmJQkREm55uwVXfmrrMHTCY",
    muxPlaybackId: "SdcHksFqSwFTrNA00s01QUNUF024kRN4J3dBf01Gp01cdcM4"
  },
  
    {
    id: 3,
    title: "Web Development Bootcamp",
    description: "Master Your  Web Development Skills",
    
    muxAssetId: "H3GQnuPMEW7ZGR16c02L2aWtUjM1RvtlnGUAbPYI3eaY",
    muxPlaybackId: "ydeeMg4zq72XayBaEXAo6YPOfNuLh00H1xGug27dmv4o"
  },
   {
    id: 4,
    title: "Devops BootCamp",
    description: "Master U r Devops Skills",
   
    muxAssetId: "I84C7NxmOPCtpWxXvoiZHE1Ew5TKkA9DvXIw2wGeOfE",
    muxPlaybackId: "Nx3D00raWMFMyEYMaosg3xDWD7bgFUXf3aM1umKZls02Q"
  },


 
];


app.get('/api/videos', (req, res) => {
  res.json(videos);
});


app.get('/api/videos/:id', (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = videos.find(v => v.id === videoId);
  
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  
  res.json(video);
});


app.get('/api/videos/:id/stream', (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = videos.find(v => v.id === videoId);
  
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  
  const streamUrl = `https://stream.mux.com/${video.muxPlaybackId}.m3u8`;
  const thumbnailUrl = `https://image.mux.com/${video.muxPlaybackId}/thumbnail.png`;
  
  res.json({
    streamUrl,
    thumbnailUrl,
    muxPlaybackId: video.muxPlaybackId,
    muxAssetId: video.muxAssetId
  });
});
app.get('/ping', (req, res) => {
  res.status(200).send('OK');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 
});