import { Alert, AppBar, Box, Chip, Container, Paper, Stack, Toolbar, Typography } from '@mui/material';

const audiences = [
  { title: 'Para quem precisa de um veículo', text: 'Encontre carros e motos por cidade, período e orçamento. Busca e reservas serão adicionadas nos próximos incrementos.' },
  { title: 'Para pessoas físicas', text: 'Uma vitrine e uma agenda para organizar a oferta de seus veículos, com perfil autodeclarado.' },
  { title: 'Para pequenas locadoras', text: 'Um espaço para apresentar a frota e acompanhar solicitações, com um responsável por empresa nesta primeira versão.' },
];

export default function App() {
  return (
    <>
      <AppBar position="static" elevation={0} color="transparent" component="header">
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Typography fontWeight={800} color="primary">Autoluguel</Typography>
          <Chip label="Projeto em desenvolvimento" size="small" variant="outlined" />
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={4}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography variant="overline" color="primary">Carros e motos • Pessoas e pequenos negócios</Typography>
            <Typography component="h1" variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.3rem', md: '3.8rem' }, my: 2 }}>
              Um lugar para encontrar. Um espaço para anunciar.
            </Typography>
            <Typography variant="h6" color="text.secondary">
              O Autoluguel está começando: um marketplace brasileiro para conectar quem precisa de um veículo a pessoas físicas e pequenas locadoras.
            </Typography>
          </Box>
          <Alert severity="info">Ambiente de demonstração, sem contratação ou cobrança. Cadastro, anúncios e reservas ainda não estão disponíveis.</Alert>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {audiences.map(({ title, text }) => (
              <Paper component="section" key={title} variant="outlined" sx={{ p: 3 }}>
                <Typography component="h2" variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
                <Typography color="text.secondary">{text}</Typography>
              </Paper>
            ))}
          </Box>
          <Typography component="footer" variant="body2" color="text.secondary">
            Construído como projeto de aprendizado em desenvolvimento de software e inteligência artificial.
          </Typography>
        </Stack>
      </Container>
    </>
  );
}
