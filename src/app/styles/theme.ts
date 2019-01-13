
const colors = {
  // from create react app
  primary: {
    font: '#000000',
    background: '#fafafa',
    border: '#000000',
  },
};

const spacing = {
  small: '10px',
  medium: '20px',
  large: '50px',
};

const atoms = {
  fields: {
    margin: spacing.medium,
  },
};

const molecules = {
  loginForm: {
    maxWidth: '500px',
    padding: spacing.medium,
    border: `1px solid ${colors.primary.border}`,
    submitMargin: spacing.medium,
    titleMargin: spacing.medium,
  },
};

const pages = {
  all: {
    background: colors.primary.background,
    fontColor: colors.primary.font,
    maxWidth: '1200px',
    verticalPadding: spacing.medium,
    horizontalPadding: spacing.medium,
  },
  landing: {
    titleMargin: spacing.medium,
    searchMargin: spacing.medium,
  },
};

export default {
  atoms,
  molecules,
  pages,
};
