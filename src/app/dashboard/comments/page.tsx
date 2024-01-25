"use client";
// comments.tsx
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";
import Star from "@/app/components/dashboard/Star";

interface Comment {
  id: number;
  comment: string;
  rate: number;
  description: number;
  agent: User;
}

function comments() {
  const [comments, setcomments] = useState<Comment[]>([]);

  useEffect(() => {
    // Fetch comments from /comments endpoint
    const fetchcomments = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        setcomments(data);
        Loading.remove();
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchcomments();
  }, []);

  return (
    <div>
      <div className="flex justify-center flex-col items-center">
        <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
          <thead>
            <tr>
              <th className="border text-blue-800 bg-slate-300">#</th>
              <th className="border text-blue-800 bg-slate-300">نام کارشناس</th>
              <th className="border text-blue-800 bg-slate-300">نظر کارشناس</th>
              <th className="border text-blue-800 bg-slate-300">نظر کاربر</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td className="border border-slate-300">{comment.id}</td>
                <td className="border border-slate-300">
                  {comment.agent.name}
                </td>
                <td className="border border-slate-300">
                  {comment.description}
                </td>
                <td className="border border-slate-300">
                  <div className="flex justify-center items-center flex-col">
                    {comment.comment}
                    <hr />
                    <Star count={comment.rate} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default comments;
