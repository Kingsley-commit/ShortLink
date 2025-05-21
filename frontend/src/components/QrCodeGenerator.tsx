import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Download, Palette, ChevronDown, ChevronUp, RefreshCw, Upload, X, RotateCcw } from 'lucide-react';
import { saveAs } from 'file-saver';

export const QRCodeGenerator = ({ url }: { url: string }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [expanded, setExpanded] = useState(true);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBackgroundColor] = useState('#FFFFFF');
  const [showColorOptions, setShowColorOptions] = useState(false);
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoSize, setLogoSize] = useState(40);
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 });
  const [showLogoOptions, setShowLogoOptions] = useState(false);
  
  const colorSchemes = [
    { fg: '#000000', bg: '#FFFFFF', name: 'Classic' },
    { fg: '#0066CC', bg: '#FFFFFF', name: 'Blue' },
    { fg: '#9900CC', bg: '#FFFFFF', name: 'Purple' },
    { fg: '#006633', bg: '#FFFFFF', name: 'Green' },
    { fg: '#CC0000', bg: '#FFFFFF', name: 'Red' },
    { fg: '#FFFFFF', bg: '#000000', name: 'Inverted' },
    { fg: '#FFFFFF', bg: '#3366CC', name: 'Navy' },
    { fg: '#FFFFFF', bg: '#6600CC', name: 'Royal' },
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoUrl) {
      URL.revokeObjectURL(logoUrl);
      setLogoUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetLogoPosition = () => {
    setLogoPosition({ x: 50, y: 50 });
    setLogoSize(40);
  };

  const downloadQRCode = async () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // I limited the Canvas size to 480
    const qrSize = 480;
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Converted SVG to canvas
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const qrImage = new Image();
    
    qrImage.onload = async () => {
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
      
      if (logoUrl) {
        const logoImage = new Image();
        logoImage.crossOrigin = 'anonymous';
        
        logoImage.onload = () => {
          const logoSizePixels = (qrSize * logoSize) / 100;
          const logoX = (qrSize * logoPosition.x) / 100 - logoSizePixels / 2;
          const logoY = (qrSize * logoPosition.y) / 100 - logoSizePixels / 2;
          
          // I added white background circle behind logo for better visibility
          const circleRadius = logoSizePixels / 2 + 8;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(
            logoX + logoSizePixels / 2,
            logoY + logoSizePixels / 2,
            circleRadius,
            0,
            2 * Math.PI
          );
          ctx.fill();
          
          ctx.drawImage(logoImage, logoX, logoY, logoSizePixels, logoSizePixels);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const filename = `qr-${url.split('/').pop() || 'code'}-with-logo.png`;
              saveAs(blob, filename);
            }
          }, 'image/png', 0.95);
        };
        
        logoImage.src = logoUrl;
      } else {
        canvas.toBlob((blob) => {
          if (blob) {
            const filename = `qr-${url.split('/').pop() || 'code'}.png`;
            saveAs(blob, filename);
          }
        }, 'image/png', 0.95);
      }
      
      URL.revokeObjectURL(svgUrl);
    };
    
    qrImage.src = svgUrl;
  };

  const applyColorScheme = (fg: string, bg: string) => {
    setFgColor(fg);
    setBackgroundColor(bg);
  };

  const resetColors = () => {
    setFgColor('#000000');
    setBackgroundColor('#FFFFFF');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">QR Code for {url.split('//').pop()}</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </motion.button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <motion.div 
              className="flex-1 flex justify-center items-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div 
                ref={qrRef} 
                className="relative p-6 rounded-xl shadow-md" 
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeSVG
                  value={url}
                  size={240}
                  level="H"
                  fgColor={fgColor}
                  bgColor={bgColor}
                  includeMargin={true}
                />
                
                {logoUrl && (
                  <div
                    className="absolute rounded-full bg-white p-1 shadow-md"
                    style={{
                      width: `${logoSize}%`,
                      height: `${logoSize}%`,
                      left: `${logoPosition.x}%`,
                      top: `${logoPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '120px',
                      maxHeight: '120px'
                    }}
                  >
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">Logo</h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setShowLogoOptions(!showLogoOptions)}
                  >
                    <Upload size={16} />
                    <span>{showLogoOptions ? "Hide Options" : "Show Options"}</span>
                  </motion.button>
                </div>

                {showLogoOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      
                      {!logoFile ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload size={24} />
                            <span className="font-medium">Upload Logo</span>
                            <span className="text-sm">PNG, JPG, SVG up to 5MB</span>
                          </div>
                        </motion.button>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img src={logoUrl} alt="Logo preview" className="w-10 h-10 object-contain rounded" />
                            <span className="text-sm font-medium text-gray-700">{logoFile.name}</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={removeLogo}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {logoFile && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Logo Size: {logoSize}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="50"
                            value={logoSize}
                            onChange={(e) => setLogoSize(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Horizontal: {logoPosition.x}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={logoPosition.x}
                              onChange={(e) => setLogoPosition(prev => ({ ...prev, x: Number(e.target.value) }))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Vertical: {logoPosition.y}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={logoPosition.y}
                              onChange={(e) => setLogoPosition(prev => ({ ...prev, y: Number(e.target.value) }))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={resetLogoPosition}
                          className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <RotateCcw size={16} />
                          <span>Reset Position</span>
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">Customize Colors</h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setShowColorOptions(!showColorOptions)}
                  >
                    <Palette size={16} />
                    <span>{showColorOptions ? "Hide Options" : "Show Options"}</span>
                  </motion.button>
                </div>

                {showColorOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">QR Code Color</label>
                        <div className="flex items-center">
                          <input 
                            type="color" 
                            value={fgColor} 
                            onChange={(e) => setFgColor(e.target.value)} 
                            className="h-10 w-10 rounded cursor-pointer border border-gray-300"
                          />
                          <input 
                            type="text" 
                            value={fgColor} 
                            onChange={(e) => setFgColor(e.target.value)}
                            className="ml-2 flex-1 p-2 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Background Color</label>
                        <div className="flex items-center">
                          <input 
                            type="color" 
                            value={bgColor} 
                            onChange={(e) => setBackgroundColor(e.target.value)} 
                            className="h-10 w-10 rounded cursor-pointer border border-gray-300"
                          />
                          <input 
                            type="text" 
                            value={bgColor} 
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="ml-2 flex-1 p-2 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetColors}
                      className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw size={16} />
                      <span>Reset Colors</span>
                    </motion.button>
                  </motion.div>
                )}

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Color Schemes</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {colorSchemes.map((scheme, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center p-2 rounded-md border border-gray-200 hover:border-blue-300"
                        onClick={() => applyColorScheme(scheme.fg, scheme.bg)}
                      >
                        <div 
                          className="w-8 h-8 rounded-full mb-1" 
                          style={{ 
                            backgroundColor: scheme.bg,
                            border: '2px solid ' + scheme.fg
                          }}
                        />
                        <span className="text-xs text-gray-600">{scheme.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#1a56db' }}
                whileTap={{ scale: 0.97 }}
                onClick={downloadQRCode}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all"
              >
                <Download size={18} />
                <span>Download QR Code{logoFile ? ' with Logo' : ''}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};