"use client";

import { useState, useEffect } from "react";
import { departmentRepository } from "@/lib/repositories/departmentRepository";
import { Department } from "@/types/po";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentRepository
      .getAll()
      .then(setDepartments)
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return { departments, loading };
}
