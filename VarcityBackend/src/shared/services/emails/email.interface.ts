export type TemplateType = 'default' | 'reset-password';

export interface IEmailJob {
  value:
    | {
        title: string;
        body: string;
      }
    | {
        receiverEmail: string;
        title: string;
        body: string;
        template: TemplateType;
      };
}
