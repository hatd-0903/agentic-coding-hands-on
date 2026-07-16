/**
 * "Root Further" marketing copy section (MoMorph Frame 486, node 3204:10152):
 * a small centered ROOT/FURTHER logo lockup above three text blocks — two VN
 * marketing paragraphs and a centered English proverb quote. Copy is taken
 * verbatim from the design (mock-data source — no invented text) and stays
 * VN-only per clarifications.md ("body VN — long Root Further marketing
 * paragraphs VN-only for now").
 */
import Image from "next/image";

const PARAGRAPH_1 =
  `Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là “problem-solver” - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.\n` +
  `Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, “Root Further” đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.\n` +
  `Vượt ra khỏi nét nghĩa bề mặt, “Root Further” chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng “địa chất” ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua từng lớp “trầm tích” để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang “hấp thụ” dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ “bén rễ” vào kỷ nguyên AI - một tầng “địa chất” hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.`;

const QUOTE = `“A tree with deep roots fears no storm”\n(Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)`;

const PARAGRAPH_2 =
  `Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương mới trên hành trình phát triển tổ chức, “Root Further” còn như một lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn.\n` +
  `Không ai biết trước ẩn sâu trong “lòng đất” của ngành công nghệ và thị trường hiện đại còn biết bao tầng “địa chất” bí ẩn. Chỉ biết rằng khi “Root Further” đã trở thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy háo hức trước bất cứ vùng vô định nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.`;

export function RootFurtherContent() {
  return (
    <section className="flex w-full flex-col items-center gap-8 px-6 py-20 sm:px-12 lg:px-26 lg:py-30">
      <div className="flex flex-col items-center">
        <Image src="/assets/home/root-text.png" alt="ROOT" width={189} height={67} className="h-auto w-32 sm:w-40" />
        <Image
          src="/assets/home/further-text.png"
          alt="FURTHER"
          width={290}
          height={67}
          className="h-auto w-48 sm:w-60"
        />
      </div>

      <div className="flex w-full max-w-[1152px] flex-col gap-10">
        {PARAGRAPH_1.split("\n").map((paragraph, index) => (
          <p key={index} className="text-justify text-base font-bold leading-relaxed text-white sm:text-lg lg:text-2xl">
            {paragraph}
          </p>
        ))}

        <p className="text-center text-lg font-bold leading-relaxed text-white sm:text-xl">
          {QUOTE.split("\n").map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </p>

        {PARAGRAPH_2.split("\n").map((paragraph, index) => (
          <p key={index} className="text-justify text-base font-bold leading-relaxed text-white sm:text-lg lg:text-2xl">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
