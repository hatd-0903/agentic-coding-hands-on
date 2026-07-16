/**
 * SAA 2025 award categories for the Awards Information page (MoMorph
 * "Hệ thống giải", D.Danh sách giải thưởng, node 313:8466). Every field is
 * transcribed verbatim from the Figma node tree (title, image, quantity,
 * prize figures) — no invented copy, per the "no invented data" mock-data
 * rule in clarifications.md. Where a bulk text query returned an
 * un-overridden component-master placeholder (every card showing "Top
 * Talent"), the actual per-instance text was read via the node's `character`
 * field instead (`get_node` / `query_section`), which reflects the real
 * Figma override.
 *
 * Slugs are the contract with the already-shipped homepage award-card
 * deep-links (`/awards#<slug>`, see `components/home/awards-section.tsx`) —
 * do not rename.
 */

export interface AwardPrize {
  /** Prize amount, e.g. "7.000.000 VNĐ". */
  value: string;
  /**
   * Short qualifier shown under the value, e.g. "cho mỗi giải thưởng".
   * Absent for Best Manager / MVP — the design has no note under their
   * single prize (node children stop after the value, unlike the other four).
   */
  note?: string;
}

export interface AwardCatalogEntry {
  slug: string;
  title: string;
  nameImgSrc: string;
  nameImgAlt: string;
  nameImgWidth: number;
  nameImgHeight: number;
  /** Full VN description paragraph, copied verbatim from the design. */
  description: string;
  /**
   * Quantity text, e.g. "10 Cá nhân" / "02 Tập thể" — rendered by callers
   * split at the first space (leading number vs. unit label), matching the
   * design's two-size type treatment.
   */
  quantity: string;
  prizes: AwardPrize[];
}

export const AWARDS_CATALOG: AwardCatalogEntry[] = [
  {
    slug: "top-talent",
    title: "Top Talent",
    nameImgSrc: "/assets/home/award-name-top-talent.png",
    nameImgAlt: "Top Talent",
    nameImgWidth: 221,
    nameImgHeight: 35,
    description:
      "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.",
    quantity: "10 Cá nhân",
    prizes: [{ value: "7.000.000 VNĐ", note: "cho mỗi giải thưởng" }],
  },
  {
    slug: "top-project",
    title: "Top Project",
    nameImgSrc: "/assets/home/award-name-top-project.png",
    nameImgAlt: "Top Project",
    nameImgWidth: 232,
    nameImgHeight: 35,
    description:
      "Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả tối ưu hóa nguồn lực và chi phí tốt, đề xuất các ý tưởng có giá trị cho khách hàng, đem lại lợi nhuận vượt trội và nhận được phản hồi tích cực từ khách hàng. Các thành viên tuân thủ nghiêm ngặt các tiêu chuẩn phát triển nội bộ trong phát triển dự án, tạo nên một hình mẫu về sự xuất sắc và chuyên nghiệp.",
    quantity: "02 Tập thể",
    prizes: [{ value: "15.000.000 VNĐ", note: "cho mỗi giải thưởng" }],
  },
  {
    slug: "top-project-leader",
    title: "Top Project Leader",
    nameImgSrc: "/assets/home/award-name-top-project-leader.png",
    nameImgAlt: "Top Project Leader",
    nameImgWidth: 232,
    nameImgHeight: 64,
    description:
      "Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy “Aim High – Be Agile” trong mọi bài toán và bối cảnh. Dưới sự dẫn dắt của họ, các thành viên không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Wasshoi, và trưởng thành để trở thành phiên bản tinh hoa – hạnh phúc hơn của chính mình.",
    quantity: "03 Cá nhân",
    prizes: [{ value: "7.000.000 VNĐ", note: "cho mỗi giải thưởng" }],
  },
  {
    slug: "best-manager",
    title: "Best Manager",
    nameImgSrc: "/assets/home/award-name-best-manager.png",
    nameImgAlt: "Best Manager",
    nameImgWidth: 232,
    nameImgHeight: 30,
    description:
      "Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn chinh phục và làm chủ mọi mục tiêu bằng năng lực đa nhiệm, khả năng phối hợp hiệu quả, và tư duy ứng dụng công nghệ linh hoạt trong kỷ nguyên số. Họ truyền cảm hứng để tập thể trở nên tự tin tràn đầy năng lượng, sẵn sàng đón nhận, thậm chí dẫn dắt tạo ra những thay đổi có tính cách mạng.",
    quantity: "01 Cá nhân",
    prizes: [{ value: "10.000.000 VNĐ" }],
  },
  {
    slug: "signature-creator",
    title: "Signature 2025 - Creator",
    nameImgSrc: "/assets/home/award-name-signature-creator.png",
    nameImgAlt: "Signature 2025 - Creator",
    nameImgWidth: 232,
    nameImgHeight: 54,
    description:
      "Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ.  Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần “Creator” đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.",
    quantity: "01 Cá nhân hoặc tập thể",
    prizes: [
      { value: "5.000.000 VNĐ", note: "cho giải cá nhân" },
      { value: "8.000.000 VNĐ", note: "cho giải tập thể" },
    ],
  },
  {
    slug: "mvp",
    title: "MVP (Most Valuable Person)",
    nameImgSrc: "/assets/home/award-name-mvp.png",
    nameImgAlt: "MVP",
    nameImgWidth: 116,
    nameImgHeight: 52,
    description:
      "Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*. Họ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun* suốt năm qua.  Không chỉ nổi bật bởi hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng lan tỏa – thông qua suy nghĩ, hành động và ảnh hưởng tích cực của mình đối với tập thể. MVP là người hội tụ đầy đủ phẩm chất của người Sun* ưu tú, đồng thời mang trên mình trọng trách lớn lao: trở thành hình mẫu đại diện cho con người và tinh thần Sun*, góp phần dẫn dắt tập thể vươn tới những đỉnh cao mới.",
    quantity: "01 Cá nhân",
    prizes: [{ value: "15.000.000 VNĐ" }],
  },
];
