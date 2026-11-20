import { Container, Section } from "../ui/Container";
import { SectionHeading } from "../ui/Heading";
import { PreviewSwitcher } from "./PreviewSwitcher";

/** Home page invitation to "Preview your own website": industry chips switch the live sample beside them. */
export function PreviewSection() {
  return (
    <Section compact labelledBy="preview-title" className="bg-paper">
      <Container>
        <PreviewSwitcher
          intro={
            <SectionHeading
              id="preview-title"
              eyebrow="Free website preview"
              title={
                <>
                  See your website <span className="text-gradient">in 60 seconds.</span>
                </>
              }
              intro="Choose your industry, add your logo and brand colour, and we'll generate a complete website for your business — instantly, and free."
            />
          }
        />
      </Container>
    </Section>
  );
}
