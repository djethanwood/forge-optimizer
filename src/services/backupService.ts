/**
 * SERVICE DE BACKUP AUTOMATIQUE
 * Backup obligatoire avant chaque modification de code
 */
export interface BackupEntry {
  id: string;
  projectId: string;
  timestamp: string;
  files: { path: string; content: string }[];
  reason: string; // 'pre-optimization', 'pre-analysis', 'manual'
}

export class BackupService {
  async createBackup(projectId: string, files: any[], reason: string): Promise<string> {
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 1. Backup local
    await this.saveLocalBackup(backupId, files);
    
    // 2. Backup PocketBase
    await this.savePocketBaseBackup(backupId, projectId, files, reason);
    
    // 3. Backup Git (si repo disponible)
    await this.saveGitBackup(backupId, files);
    
    return backupId;
  }
  
  // BACKUP OBLIGATOIRE avant modification
  async mandatoryBackupBeforeModification(projectId: string, files: any[]): Promise<string> {
    console.log('🔒 BACKUP OBLIGATOIRE avant modification...');
    return await this.createBackup(projectId, files, 'pre-optimization');
  }
}
