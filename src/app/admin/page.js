"use client";
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import Link from "next/link";
import styles from "./admin.module.scss";
import wishArray from "@/api/wishes";

const cx = classNames.bind(styles);

const attendanceLabels = {
  yes: "Sẽ đến dự tiệc",
  no: "Không thể đến dự",
  or: "Chưa chốt",
};

export default function AdminPage() {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [wishText, setWishText] = useState("");
  const [isAttend, setIsAttend] = useState("yes");

  useEffect(() => {
    const sorted = [...wishArray].sort((a, b) => b.createdAt - a.createdAt);
    setWishes(sorted);
  }, []);

  const stats = useMemo(() => {
    return {
      total: wishes.length,
      yes: wishes.filter((item) => item.isAttend === "yes").length,
      no: wishes.filter((item) => item.isAttend === "no").length,
      or: wishes.filter((item) => item.isAttend === "or").length,
    };
  }, [wishes]);

  const handleAddWish = () => {
    if (!name.trim() || !wishText.trim()) return;

    const next = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      name: name.trim(),
      wish: wishText.trim(),
      isAttend,
    };

    setWishes((prev) => [next, ...prev]);
    setName("");
    setWishText("");
    setIsAttend("yes");
  };

  const handleDelete = (id) => {
    setWishes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAttendanceChange = (id, value) => {
    setWishes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAttend: value } : item
      )
    );
  };

  return (
    <div className={cx("wrapper")}> 
      <div className={cx("head")}> 
        <div>
          <h1 className={cx("title")}>Admin quản lý lời chúc</h1>
          <p className={cx("subtitle")}>Quản lý, thêm và xem thống kê lời chúc bằng giao diện.</p>
        </div>
        <Link href="/" className={cx("backLink")}>Về trang chính</Link>
      </div>

      <div className={cx("stats")}> 
        <div className={cx("statCard")}>
          <span className={cx("statNumber")}>{stats.total}</span>
          <span>Tổng lời chúc</span>
        </div>
        <div className={cx("statCard")}>
          <span className={cx("statNumber")}>{stats.yes}</span>
          <span>Sẽ đến</span>
        </div>
        <div className={cx("statCard")}>
          <span className={cx("statNumber")}>{stats.no}</span>
          <span>Không đến</span>
        </div>
        <div className={cx("statCard")}>
          <span className={cx("statNumber")}>{stats.or}</span>
          <span>Chưa chốt</span>
        </div>
      </div>

      <section className={cx("panel")}> 
        <div className={cx("panelSection")}> 
          <h2 className={cx("sectionTitle")}>Thêm lời chúc mới</h2>
          <div className={cx("form")}> 
            <label className={cx("label")}>Tên khách mời</label>
            <input
              className={cx("input")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên"
            />
            <label className={cx("label")}>Nội dung lời chúc</label>
            <textarea
              className={cx("textarea")}
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Nhập lời chúc"
              rows={4}
            />
            <label className={cx("label")}>Tình trạng tham dự</label>
            <select
              className={cx("select")}
              value={isAttend}
              onChange={(e) => setIsAttend(e.target.value)}
            >
              <option value="yes">Sẽ đến dự tiệc</option>
              <option value="no">Không thể đến dự</option>
              <option value="or">Chưa chốt</option>
            </select>
            <button className={cx("button")} onClick={handleAddWish}>
              Thêm lời chúc
            </button>
          </div>
        </div>

        <div className={cx("panelSection")}> 
          <h2 className={cx("sectionTitle")}>Danh sách lời chúc</h2>
          <div className={cx("list")}> 
            {wishes.length === 0 ? (
              <p className={cx("empty")}>Chưa có lời chúc nào.</p>
            ) : (
              wishes.map((item) => (
                <div className={cx("wishCard")} key={item.id}>
                  <div className={cx("wishHeader")}> 
                    <span className={cx("wishName")}>{item.name}</span>
                    <button
                      className={cx("deleteButton")}
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                  <p className={cx("wishText")}>{item.wish}</p>
                  <div className={cx("wishFooter")}> 
                    <select
                      className={cx("select")}
                      value={item.isAttend}
                      onChange={(e) => handleAttendanceChange(item.id, e.target.value)}
                    >
                      <option value="yes">Sẽ đến dự tiệc</option>
                      <option value="no">Không thể đến dự</option>
                      <option value="or">Chưa chốt</option>
                    </select>
                    <span className={cx("status")}>{attendanceLabels[item.isAttend]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <p className={cx("note")}>
        Lưu ý: dữ liệu hiện tại chỉ quản lý trên giao diện và chưa có lưu trữ vĩnh viễn.
      </p>
    </div>
  );
}
