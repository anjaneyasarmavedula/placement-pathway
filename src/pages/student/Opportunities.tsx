import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Briefcase, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import ApplyModal from "@/components/student/ApplyModal";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const Opportunities = () => {
	const [opportunities, setOpportunities] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [applyOpen, setApplyOpen] = useState(false);
	const [selectedOpp, setSelectedOpp] = useState<any>(null);
	const { toast } = useToast();

	useEffect(() => {
		const fetchOpportunities = async () => {
			setLoading(true);
			setError("");
			try {
				const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
				const token = localStorage.getItem("token");
				const res = await axios.get(`${baseUrl}/opportunities`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setOpportunities(res.data.opportunities || []);
			} catch (err: any) {
				setError(
					err?.response?.data?.message || "Failed to load opportunities"
				);
			} finally {
				setLoading(false);
			}
		};
		fetchOpportunities();
	}, []);

	const handleApplyClick = (opp: any) => {
		setSelectedOpp(opp);
		setApplyOpen(true);
	};

	const handleApplySubmit = async (data: { additionalInfo: string }) => {
		if (!selectedOpp) return;
		try {
			const token = localStorage.getItem("token");
			const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
			// Fix: get companyId and position from DB fields
			const companyId = selectedOpp.company?._id || selectedOpp.company || selectedOpp.companyId;
			const position = selectedOpp.role || selectedOpp.title || selectedOpp.position;
			await axios.post(
				`${baseUrl}/student/apply`,
				{
					opportunityId: selectedOpp._id,
					companyId,
					position,
					additionalInfo: data.additionalInfo,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast({
				title: "Application Submitted",
				description: `You have applied for ${position} at ${selectedOpp.company?.name || selectedOpp.company}.`,
			});
			setApplyOpen(false);
		} catch (err: any) {
			toast({
				title: "Application Failed",
				description:
					err?.response?.data?.message || "Could not apply.",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<span>Loading opportunities...</span>
			</div>
		);
	}
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<span className="text-destructive">{error}</span>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar userRole="student" />
			<div className="max-w-5xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6">Open Opportunities</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{opportunities.map((opp) => (
						<Card key={opp._id} className="p-6 flex flex-col justify-between">
							<div>
								<div className="flex items-center gap-3 mb-2">
									<Briefcase className="w-5 h-5 text-primary" />
									<span className="font-semibold text-lg">
										{opp.company?.name || opp.company}
									</span>
								</div>
								<h2 className="text-xl font-bold mb-1">
									{opp.position || opp.title}
								</h2>
								<p className="text-muted-foreground mb-2">
									{opp.location}
								</p>
								<p className="text-sm mb-3">{opp.description}</p>
								<p className="text-xs text-muted-foreground mb-2">
									Deadline:{" "}
									{opp.deadline
										? new Date(opp.deadline).toLocaleDateString()
										: "-"}
								</p>
							</div>
							<Button
								className="mt-2 w-fit"
								variant="default"
								size="sm"
								onClick={() => handleApplyClick(opp)}
							>
								Apply{" "}
								<ArrowRight className="w-4 h-4 ml-1" />
							</Button>
						</Card>
					))}
				</div>
				<ApplyModal
					open={applyOpen}
					onClose={() => setApplyOpen(false)}
					onSubmit={handleApplySubmit}
					company={selectedOpp?.company?.name || selectedOpp?.company || ""}
					position={selectedOpp?.position || selectedOpp?.title || ""}
				/>
			</div>
		</div>
	);
};

export default Opportunities;
