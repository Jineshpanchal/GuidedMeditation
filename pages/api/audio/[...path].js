export default async function handler(req, res) {
  const { path } = req.query;
  
  if (!path || path.length === 0) {
    return res.status(400).json({ error: 'No path specified' });
  }
  
  const fullPath = Array.isArray(path) ? path.join('/') : path;
  const audioUrl = `https://bkstrapiapp.blob.core.windows.net/strapi-uploads/assets/${fullPath}`;
  
  try {
    const audioResponse = await fetch(audioUrl);
    
    if (!audioResponse.ok) {
      return res.status(audioResponse.status).json({
        error: `Failed to fetch audio: ${audioResponse.statusText}`
      });
    }
    
    // Get the content type from the response
    const contentType = audioResponse.headers.get('content-type');
    
    // Stream the response to the client
    res.setHeader('Content-Type', contentType || 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    const audioStream = await audioResponse.arrayBuffer();
    res.send(Buffer.from(audioStream));
  } catch (error) {
    console.error('Error proxying audio:', error);
    res.status(500).json({ error: 'Failed to proxy audio file' });
  }
} 