import { CameraView, useCameraPermissions } from 'expo-camera';
import { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const API_URL = 'http://192.168.1.3:3333/api/presences';

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [statusText, setStatusText] = useState('Aponte a câmera para o QR Code do crachá.');
  const [statusType, setStatusType] = useState<'idle' | 'success' | 'warning' | 'error'>('idle');

  const statusStyle = useMemo(() => {
    switch (statusType) {
      case 'success':
        return styles.statusSuccess;
      case 'warning':
        return styles.statusWarning;
      case 'error':
        return styles.statusError;
      default:
        return styles.statusIdle;
    }
  }, [statusType]);

  async function handleScan(data: string) {
    setScanned(true);
    setStatusText('Registrando presença...');
    setStatusType('idle');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: data }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.erro || result.error || 'Falha ao registrar presença');

      const duplicate = result.status === 'duplicate';
      setStatusType(duplicate ? 'warning' : 'success');
      setStatusText(result.message || (duplicate ? 'Presença já registrada.' : 'Presença registrada com sucesso.'));
      Alert.alert(duplicate ? 'Aviso' : 'Sucesso', result.message || 'Presença registrada com sucesso.');
    } catch (error: any) {
      setStatusType('error');
      setStatusText(error.message || 'Não conseguiu registrar presença.');
      Alert.alert('Erro', error.message || 'Não conseguiu registrar presença.');
    }
  }

  if (!permission) return <View style={styles.screen} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Permitir acesso à câmera</Text>
          <Text style={styles.permissionText}>
            O leitor de presença precisa usar a câmera para escanear o QR Code do crachá.
          </Text>
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Permitir câmera</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>IPDA • Leitor de presença</Text>
        <Text style={styles.title}>Leitura por QR Code</Text>
        <Text style={styles.subtitle}>Use o celular para registrar a presença do membro em segundos.</Text>
      </View>

      <View style={styles.cameraCard}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : ({ data }) => handleScan(data)}
        />
        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.scanFrame} />
        </View>
      </View>

      <View style={[styles.statusCard, statusStyle]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      <Pressable style={[styles.primaryButton, styles.fullButton, !scanned && styles.disabledButton]} onPress={() => {
        setScanned(false);
        setStatusType('idle');
        setStatusText('Aponte a câmera para o QR Code do crachá.');
      }}>
        <Text style={styles.primaryButtonText}>Escanear novamente</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0e1733',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 18,
    paddingBottom: 16,
  },
  eyebrow: {
    color: '#93a6d8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#c5d1f0',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  cameraCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#101b3b',
    height: 430,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: '#31d36f',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  statusCard: {
    marginTop: 18,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  statusIdle: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statusSuccess: {
    backgroundColor: 'rgba(40,199,111,0.16)',
    borderColor: 'rgba(40,199,111,0.30)',
  },
  statusWarning: {
    backgroundColor: 'rgba(244,220,50,0.18)',
    borderColor: 'rgba(244,220,50,0.34)',
  },
  statusError: {
    backgroundColor: 'rgba(255,107,74,0.16)',
    borderColor: 'rgba(255,107,74,0.30)',
  },
  statusText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#28c76f',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullButton: {
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.8,
  },
  permissionCard: {
    marginTop: 120,
    backgroundColor: '#131f44',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  permissionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  permissionText: {
    color: '#c5d1f0',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
});
