import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Rocket, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface VercelDeployProps {
  children: React.ReactNode;
}

const VercelDeploy = ({ children }: VercelDeployProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [projectName, setProjectName] = useState("pandanexus-app");
  const [deployUrl, setDeployUrl] = useState("");

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployStatus('deploying');
    
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockUrl = `https://${projectName}-${Math.random().toString(36).substr(2, 8)}.vercel.app`;
      setDeployUrl(mockUrl);
      setDeployStatus('success');
      
      toast("🚀 Deployment Successful!", {
        description: "Your app is now live on Vercel",
        duration: 5000,
      });
    } catch (error) {
      setDeployStatus('error');
      toast("❌ Deployment Failed", {
        description: "Please check your configuration and try again",
        duration: 5000,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const openVercelDashboard = () => {
    window.open('https://vercel.com/dashboard', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-gradient-glass backdrop-blur-xl border-glass-border shadow-glass">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-text bg-clip-text text-transparent text-center flex items-center justify-center gap-2">
            <Rocket className="w-6 h-6" />
            Deploy to Vercel
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Project Configuration */}
          <Card className="p-4 bg-gradient-glass border-glass-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Project Settings</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-app"
                  className="bg-input/50 border-glass-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Framework</p>
                  <Badge variant="outline" className="mt-1">React + Vite</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Build Command</p>
                  <Badge variant="outline" className="mt-1">npm run build</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Deployment Status */}
          {deployStatus !== 'idle' && (
            <Card className="p-4 bg-gradient-glass border-glass-border">
              <div className="flex items-center gap-3">
                {deployStatus === 'deploying' && (
                  <>
                    <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <span>Deploying to Vercel...</span>
                  </>
                )}
                {deployStatus === 'success' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Deployment Successful!</span>
                  </>
                )}
                {deployStatus === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Deployment Failed</span>
                  </>
                )}
              </div>
              
              {deployUrl && (
                <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Live URL:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-background/50 px-2 py-1 rounded">
                      {deployUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(deployUrl, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Deploy Button */}
          <div className="space-y-3">
            <Button
              onClick={handleDeploy}
              disabled={isDeploying || !projectName.trim()}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12"
            >
              {isDeploying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                  Deploying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Deploy to Vercel
                </div>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={openVercelDashboard}
              className="w-full bg-gradient-glass border-glass-border hover:shadow-glow"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Vercel Dashboard
            </Button>
          </div>

          {/* Info */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>🚀 Deploy your PandaNexus app to Vercel</p>
            <p>⚡ Automatic builds • 🌍 Global CDN • 📊 Analytics</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VercelDeploy;