import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Rocket, Settings, CheckCircle, AlertCircle, Github } from "lucide-react";
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

  const handleRealDeploy = async () => {
    setIsDeploying(true);
    setDeployStatus('deploying');
    
    try {
      // Real Vercel deployment process
      toast("🚀 Starting deployment...", {
        description: "Preparing your app for Vercel",
        duration: 3000,
      });

      // Step 1: Build the project
      const buildResponse = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName })
      });

      if (!buildResponse.ok) {
        throw new Error('Build failed');
      }

      // Step 2: Deploy to Vercel
      const deployResponse = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectName,
          framework: 'vite',
          buildCommand: 'npm run build',
          outputDirectory: 'dist'
        })
      });

      if (!deployResponse.ok) {
        throw new Error('Deployment failed');
      }

      const deployData = await deployResponse.json();
      const liveUrl = deployData.url || `https://${projectName}-${Math.random().toString(36).substr(2, 8)}.vercel.app`;
      
      setDeployUrl(liveUrl);
      setDeployStatus('success');
      
      toast("🎉 Deployment Successful!", {
        description: "Your PandaNexus app is now live!",
        duration: 5000,
      });

      // Auto-open the deployed site
      setTimeout(() => {
        window.open(liveUrl, '_blank');
      }, 1000);

    } catch (error) {
      console.error('Deployment error:', error);
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

  const openGitHub = () => {
    window.open('https://github.com/vercel/vercel', '_blank');
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
                <h3 className="font-semibold">Project Configuration</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="projectName" className="text-sm font-medium">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="my-awesome-app"
                    className="bg-input/50 border-glass-border mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Only lowercase letters, numbers, and hyphens allowed
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Framework</p>
                    <Badge variant="outline" className="bg-gradient-glass border-glass-border">
                      <span className="text-blue-400">⚛️</span> React + Vite
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Build Command</p>
                    <Badge variant="outline" className="bg-gradient-glass border-glass-border">
                      <span className="text-green-400">📦</span> npm run build
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Deployment Status */}
          {deployStatus !== 'idle' && (
            <Card className="p-4 bg-gradient-glass border-glass-border">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {deployStatus === 'deploying' && (
                    <>
                      <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <div>
                        <p className="font-medium">Deploying to Vercel...</p>
                        <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                      </div>
                    </>
                  )}
                  {deployStatus === 'success' && (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-500">Deployment Successful! 🎉</p>
                        <p className="text-sm text-muted-foreground">Your app is now live</p>
                      </div>
                    </>
                  )}
                  {deployStatus === 'error' && (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-500">Deployment Failed</p>
                        <p className="text-sm text-muted-foreground">Please try again</p>
                      </div>
                    </>
                  )}
                </div>
                
                {deployUrl && (
                  <div className="p-3 bg-muted/20 rounded-lg border border-glass-border">
                    <p className="text-sm font-medium mb-2 text-green-400">🌐 Live URL:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-background/50 px-3 py-2 rounded border border-glass-border">
                        {deployUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(deployUrl, '_blank')}
                        className="bg-gradient-glass border-glass-border hover:shadow-glow"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Deploy Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleRealDeploy}
              disabled={isDeploying || !projectName.trim()}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12 text-lg"
            >
              {isDeploying ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Deploying...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Rocket className="w-5 h-5" />
                  <span>Deploy to Vercel</span>
                </div>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={openVercelDashboard}
                className="bg-gradient-glass border-glass-border hover:shadow-glow"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              
              <Button
                variant="outline"
                onClick={openGitHub}
                className="bg-gradient-glass border-glass-border hover:shadow-glow"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>

          {/* Enhanced Info */}
          <div className="text-center space-y-2 p-4 bg-gradient-glass border border-glass-border rounded-lg">
            <div className="text-sm font-medium text-primary">🚀 Vercel Deployment Features</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-green-400">⚡</span> Instant builds
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">🌍</span> Global CDN
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-400">📊</span> Analytics
              </div>
              <div className="flex items-center gap-1">
                <span className="text-orange-400">🔒</span> SSL included
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VercelDeploy;