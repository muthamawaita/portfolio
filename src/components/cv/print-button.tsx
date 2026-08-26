"use client";

import { ArrowDown } from "lucide-react";

export function PrintButton() { return <button className="button button-dark print-button" onClick={() => window.print()}><ArrowDown size={16} /> Download / print CV</button>; }
