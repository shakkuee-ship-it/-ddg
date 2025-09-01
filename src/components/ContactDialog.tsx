import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, Copy, ExternalLink, Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ContactDialogProps {
  children: React.ReactNode;
}

const ContactDialog = ({ children }: ContactDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const contactInfo = {
    email: "shakeelsk@pandascanpros.in",
    phone: "+91 8074015276",
    name: "Shakeel"
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${type} copied!`, {
        description: text,
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast(`Failed to copy ${type}`, {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Hello from PandaNexus User");
    const body = encodeURIComponent(`Hi Shakeel,

I'm reaching out from PandaNexus. 

[Please describe your message here]

Best regards,
[Your name]`);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    
    toast("📧 Opening Gmail...", {
      description: "Redirecting to Gmail compose",
      duration: 3000,
    });
    
    setIsOpen(false);
  };

  const callPhone = () => {
    window.open(`tel:${contactInfo.phone}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-glass backdrop-blur-xl border-glass-border shadow-glass">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-text bg-clip-text text-transparent text-center">
            Contact PandaNexus
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Creator Profile */}
          <div className="text-center space-y-3">
            <div className="relative mx-auto w-20 h-20">
              <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <span className="text-2xl font-bold text-primary-foreground">S</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                <span className="text-xs">👨‍💻</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Shakeel</h3>
              <p className="text-muted-foreground">Creator & Developer of PandaNexus</p>
              <Badge variant="outline" className="mt-2 bg-gradient-glass border-glass-border">
                <span className="text-green-400">●</span> Available for support
              </Badge>
            </div>
          </div>

          {/* Quick Contact Actions */}
          <div className="space-y-3">
            {/* Send Email - Direct Gmail */}
            <Card className="p-4 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300 cursor-pointer" onClick={sendEmail}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Send className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Send Message</p>
                    <p className="text-sm text-muted-foreground">Open Gmail to compose</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            {/* Email Contact */}
            <Card className="p-4 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground break-all">{contactInfo.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(contactInfo.email, 'Email')}
                  className="bg-gradient-glass border-glass-border hover:shadow-glow"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Phone Contact */}
            <Card className="p-4 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(contactInfo.phone, 'Phone')}
                    className="bg-gradient-glass border-glass-border hover:shadow-glow"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={callPhone}
                    className="bg-gradient-primary hover:shadow-glow"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Support Information */}
          <Card className="p-4 bg-gradient-glass border-glass-border">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <p className="font-medium">Support & Feedback</p>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Bug reports and feature requests</p>
                <p>• Technical support and guidance</p>
                <p>• Business inquiries and partnerships</p>
                <p>• General questions about PandaNexus</p>
              </div>
              
              <div className="pt-2 border-t border-glass-border">
                <p className="text-xs text-muted-foreground text-center">
                  Response time: Usually within 24 hours
                </p>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-glass-border space-y-2">
            <p className="text-sm font-medium">PandaNexus AI Platform</p>
            <p className="text-xs text-muted-foreground">
              Built with ❤️ by Shakeel • © 2025 PandaNexus
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>🚀 Advanced AI</span>
              <span>⚡ Lightning Fast</span>
              <span>🔒 Secure</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;