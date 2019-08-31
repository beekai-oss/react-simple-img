import React from "react";
import { SimpleImg } from "../src/index";

export const Image = <SimpleImg src="https://example.com" />;

export const ImageWithAspectRatio = (
  <SimpleImg src="https://example.com" applyAspectRatio />
);

export const ImageWithHighImportance = (
  <SimpleImg src="https://example.com" importance="high" />
);
