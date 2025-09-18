import { Button } from "@/components/ui/button";
import {
  Download,
  ArrowLeft,
  RotateCcw,
  RotateCw,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Toolbar({ onExport }) {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Button asChild className="bg-emerald-400 hover:bg-emerald-600">
            <Link to="/resumetemplate">
              <ArrowLeft />
              Resumes
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button size="icon" className="text-white hover: bg-gray-600">
            <RotateCw />
          </Button>
          <Button size="icon" className="text-white hover: bg-gray-600">
            <RotateCcw />
          </Button> */}
          {/* <Button size="icon" className="text-white hover: bg-gray-600">
            <MoreVertical />
          </Button> */}
          <Button
            variant="default"
            onClick={onExport}
            className="bg-emerald-400 text-black hover:bg-emerald-600"
          >
            <Download />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
