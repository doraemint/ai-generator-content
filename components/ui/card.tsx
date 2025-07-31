import * as React from "react";
import clsx from "clsx";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "rounded-xl overflow-hidden", // รูปทรงมุมโค้งมนและตัด overflow
        "bg-white dark:bg-neutral-900", // รองรับธีมสว่างและมืด
        "border border-gray-200 dark:border-neutral-700", // สี border ตาม theme
        "shadow-md hover:shadow-lg transition-shadow duration-300", // shadow ที่เปลี่ยนตาม hover แบบนุ่มนวล
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "p-6", // padding ที่มากขึ้นให้เนื้อหาไม่ชิดขอบ
        "text-gray-800 dark:text-gray-100", // สีข้อความที่เหมาะสมกับธีม
        "transition-all duration-200", // transition เพื่อความนุ่มนวล
        className
      )}
    >
      {children}
    </div>
  );
};
