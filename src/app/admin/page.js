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

  // Wedding config states
  const [brideName, setBrideName] = useState("Trần Thị Thúy");
  const [groomName, setGroomName] = useState("Lang Mạnh Hùng");
  const [weddingDate, setWeddingDate] = useState("22/05/2026");
  const [weddingTime, setWeddingTime] = useState("11:00");
  const [weddingAddress, setWeddingAddress] = useState("Tổ 23A , xã tân lập , huyện đồng phú , tỉnh bình phước");
  const [googleMapsAddress, setGoogleMapsAddress] = useState("Tổ 23A , xã tân lập , huyện đồng phú , tỉnh bình phước");
  const [albumImages, setAlbumImages] = useState([
    "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5/e1",
    "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5/e3",
    "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5/e4",
    "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5/e5",
    "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5/e7",
    "https://res.cloudinary.com/do6sozxbo/image/upload/f_auto,q_auto/v1/wedding5/e8"
  ]);

  useEffect(() => {
    const sorted = [...wishArray].sort((a, b) => b.createdAt - a.createdAt);
    setWishes(sorted);

    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('weddingConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setBrideName(config.brideName || brideName);
      setGroomName(config.groomName || groomName);
      setWeddingDate(config.weddingDate || weddingDate);
      setWeddingTime(config.weddingTime || weddingTime);
      setWeddingAddress(config.weddingAddress || weddingAddress);
      setGoogleMapsAddress(config.googleMapsAddress || googleMapsAddress);
      setAlbumImages(config.albumImages || albumImages);
    }
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

  const saveWeddingConfig = () => {
    const config = {
      brideName,
      groomName,
      weddingDate,
      weddingTime,
      weddingAddress,
      googleMapsAddress,
      albumImages,
    };
    localStorage.setItem('weddingConfig', JSON.stringify(config));
    alert('Đã lưu cấu hình đám cưới!');
  };

  const exportConfig = () => {
    const config = {
      brideName,
      groomName,
      weddingDate,
      weddingTime,
      weddingAddress,
      googleMapsAddress,
      albumImages,
    };
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'wedding-config.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          setBrideName(config.brideName || brideName);
          setGroomName(config.groomName || groomName);
          setWeddingDate(config.weddingDate || weddingDate);
          setWeddingTime(config.weddingTime || weddingTime);
          setWeddingAddress(config.weddingAddress || weddingAddress);
          setGoogleMapsAddress(config.googleMapsAddress || googleMapsAddress);
          setAlbumImages(config.albumImages || albumImages);
          localStorage.setItem('weddingConfig', JSON.stringify(config));
          alert('Đã import cấu hình thành công!');
        } catch (error) {
          alert('File không hợp lệ!');
        }
      };
      reader.readAsText(file);
    }
  };

  const addAlbumImage = () => {
    const newImage = prompt('Nhập URL hình ảnh mới:');
    if (newImage && newImage.trim()) {
      setAlbumImages([...albumImages, newImage.trim()]);
    }
  };

  const removeAlbumImage = (index) => {
    setAlbumImages(albumImages.filter((_, i) => i !== index));
  };

  return (
    <div className={cx("wrapper")}> 
      <div className={cx("head")}> 
        <div>
          <h1 className={cx("title")}>Admin quản lý đám cưới</h1>
          <p className={cx("subtitle")}>Quản lý thông tin đám cưới và lời chúc</p>
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
          <h2 className={cx("sectionTitle")}>Cấu hình đám cưới</h2>
          <div className={cx("form")}> 
            <label className={cx("label")}>Tên cô dâu</label>
            <input
              className={cx("input")}
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="Nhập tên cô dâu"
            />
            
            <label className={cx("label")}>Tên chú rể</label>
            <input
              className={cx("input")}
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              placeholder="Nhập tên chú rể"
            />
            
            <label className={cx("label")}>Ngày cưới (DD/MM/YYYY)</label>
            <input
              className={cx("input")}
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              placeholder="22/05/2026"
            />
            
            <label className={cx("label")}>Giờ cưới</label>
            <input
              className={cx("input")}
              value={weddingTime}
              onChange={(e) => setWeddingTime(e.target.value)}
              placeholder="11:00"
            />
            
            <label className={cx("label")}>Địa chỉ cưới</label>
            <textarea
              className={cx("textarea")}
              value={weddingAddress}
              onChange={(e) => setWeddingAddress(e.target.value)}
              placeholder="Nhập địa chỉ cưới"
              rows={3}
            />
            
            <label className={cx("label")}>Địa chỉ Google Maps</label>
            <textarea
              className={cx("textarea")}
              value={googleMapsAddress}
              onChange={(e) => setGoogleMapsAddress(e.target.value)}
              placeholder="Nhập địa chỉ cho Google Maps"
              rows={3}
            />
            
            <div className={cx("buttonGroup")}>
              <button className={cx("button")} onClick={saveWeddingConfig}>
                Lưu cấu hình
              </button>
              <button className={cx("button", "secondary")} onClick={exportConfig}>
                Export cấu hình
              </button>
              <label className={cx("button", "secondary")}>
                Import cấu hình
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfig}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className={cx("panelSection")}> 
          <h2 className={cx("sectionTitle")}>Quản lý album hình ảnh</h2>
          <div className={cx("albumManager")}>
            <button className={cx("button")} onClick={addAlbumImage}>
              Thêm hình ảnh
            </button>
            <div className={cx("imageGrid")}>
              {albumImages.map((image, index) => (
                <div key={index} className={cx("imageItem")}>
                  <img src={image} alt={`Album ${index + 1}`} className={cx("thumbnail")} />
                  <button 
                    className={cx("removeButton")}
                    onClick={() => removeAlbumImage(index)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
        Lưu ý: Dữ liệu được lưu trong trình duyệt. Export cấu hình để sao lưu.
      </p>
    </div>
  );
}
