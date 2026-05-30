export type LovePageFormFields = {
    title: string;
    sender_name: string;
    recipient_name: string;
    message: string;
};

export type LovePageFieldErrors = Partial<
    Record<keyof LovePageFormFields, string>
>;

const MIN_MESSAGE_LENGTH = 10;

export function validateLovePageBasics(
    data: LovePageFormFields
): LovePageFieldErrors {
    const errors: LovePageFieldErrors = {};

    const title = data.title.trim();
    const sender = data.sender_name.trim();
    const recipient = data.recipient_name.trim();
    const message = data.message.trim();

    if (!title) {
        errors.title = "Add a page title";
    } else if (title.length < 2) {
        errors.title = "Title is too short";
    }

    if (!sender) {
        errors.sender_name = "Add your name";
    }

    if (!recipient) {
        errors.recipient_name = "Add their name (used for your share link)";
    } else if (recipient.length < 2) {
        errors.recipient_name = "Name is too short";
    }

    if (!message) {
        errors.message = "Write a message from your heart";
    } else if (message.length < MIN_MESSAGE_LENGTH) {
        errors.message = `Message needs at least ${MIN_MESSAGE_LENGTH} characters`;
    }

    return errors;
}

export function isLovePageBasicsValid(data: LovePageFormFields): boolean {
    return Object.keys(validateLovePageBasics(data)).length === 0;
}

export function basicsCompletionCount(data: LovePageFormFields): number {
    let n = 0;
    if (data.title.trim().length >= 2) n++;
    if (data.sender_name.trim()) n++;
    if (data.recipient_name.trim().length >= 2) n++;
    if (data.message.trim().length >= MIN_MESSAGE_LENGTH) n++;
    return n;
}
