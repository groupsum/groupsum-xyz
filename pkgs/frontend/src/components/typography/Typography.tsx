import React from "react";

type ClassNameProps = { children: React.ReactNode; className?: string };

function classes(role: string, className?: string) {
  return className ? `${role} ${className}` : role;
}

export function PageTitle({ children, className }: ClassNameProps) {
  return <h1 className={classes("type-display-lg", className)}>{children}</h1>;
}

export function SectionTitle({ children, className }: ClassNameProps) {
  return <h2 className={classes("type-heading-md", className)}>{children}</h2>;
}

export function CardTitle({ children, className }: ClassNameProps) {
  return <h3 className={classes("type-heading-sm", className)}>{children}</h3>;
}

export function BodyText({ children, className, size = "md" }: ClassNameProps & { size?: "lg" | "md" | "sm" }) {
  return <p className={classes(`type-body-${size}`, className)}>{children}</p>;
}

export function UiLabel({ children, className }: ClassNameProps) {
  return <span className={classes("type-ui-label", className)}>{children}</span>;
}

export function ControlText({ children, className }: ClassNameProps) {
  return <span className={classes("type-control", className)}>{children}</span>;
}

export function TechnicalText({ children, className, as = "span" }: ClassNameProps & { as?: "span" | "code" }) {
  return React.createElement(as, { className: classes("type-technical", className) }, children);
}
