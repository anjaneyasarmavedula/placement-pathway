import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { additionalInfo: string }) => void;
  company: string;
  position: string;
}

const ApplyModal = ({ open, onClose, onSubmit, company, position }: ApplyModalProps) => {
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({ additionalInfo });
    setSubmitting(false);
    setAdditionalInfo("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for {position} at {company}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Additional Information (optional)</label>
            <Textarea
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value)}
              placeholder="Why are you a good fit?"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Applying..." : "Submit Application"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
