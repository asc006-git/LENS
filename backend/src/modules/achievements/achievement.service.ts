import mongoose, { Schema, Document } from 'mongoose';
import { NotFoundError } from '../../common/errors';

export interface IAchievement extends Document {
  student: mongoose.Types.ObjectId;
  type: string;
  title: string;
  description: string;
  icon: string;
  criteria: Record<string, any>;
  earnedAt?: Date;
  claimed: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'trophy',
    },
    criteria: {
      type: Schema.Types.Mixed,
      default: {},
    },
    earnedAt: {
      type: Date,
    },
    claimed: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ student: 1, type: 1 });
achievementSchema.index({ student: 1, earnedAt: -1 });

const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);

export class AchievementService {
  private static readonly ACHIEVEMENT_DEFINITIONS = [
    {
      type: 'first_session',
      title: 'First Steps',
      description: 'Complete your first learning session',
      icon: 'rocket',
      criteria: { sessionCount: 1 },
    },
    {
      type: 'five_sessions',
      title: 'Getting Serious',
      description: 'Complete 5 learning sessions',
      icon: 'fire',
      criteria: { sessionCount: 5 },
    },
    {
      type: 'ten_sessions',
      title: 'Knowledge Seeker',
      description: 'Complete 10 learning sessions',
      icon: 'book',
      criteria: { sessionCount: 10 },
    },
    {
      type: 'high_confidence',
      title: 'Confident Learner',
      description: 'Achieve 80%+ confidence in a session',
      icon: 'star',
      criteria: { minConfidence: 0.8 },
    },
    {
      type: 'perfect_session',
      title: 'Perfectionist',
      description: 'Achieve 95%+ confidence in a session',
      icon: 'crown',
      criteria: { minConfidence: 0.95 },
    },
    {
      type: 'streak_3',
      title: 'Consistent Learner',
      description: 'Complete sessions 3 days in a row',
      icon: 'calendar',
      criteria: { streak: 3 },
    },
    {
      type: 'streak_7',
      title: 'Week Warrior',
      description: 'Complete sessions 7 days in a row',
      icon: 'flame',
      criteria: { streak: 7 },
    },
    {
      type: 'master_concept',
      title: 'Concept Master',
      description: 'Achieve 90%+ mastery on any concept',
      icon: 'brain',
      criteria: { masteryThreshold: 0.9 },
    },
  ];

  static async evaluateAchievements(studentId: string): Promise<IAchievement[]> {
    const sessions = await mongoose.model('LearningSession').find({
      student: studentId,
      status: 'completed',
    }).sort({ updatedAt: -1 });

    const newAchievements: IAchievement[] = [];

    for (const definition of this.ACHIEVEMENT_DEFINITIONS) {
      const existing = await Achievement.findOne({
        student: studentId,
        type: definition.type,
      });

      if (existing) {
        continue;
      }

      let earned = false;
      let metadata: Record<string, any> = {};

      switch (definition.type) {
        case 'first_session':
          earned = sessions.length >= 1;
          metadata = { sessionCount: sessions.length };
          break;
        case 'five_sessions':
          earned = sessions.length >= 5;
          metadata = { sessionCount: sessions.length };
          break;
        case 'ten_sessions':
          earned = sessions.length >= 10;
          metadata = { sessionCount: sessions.length };
          break;
        case 'high_confidence':
          earned = sessions.some((s) => s.validation.overallConfidence >= 0.8);
          metadata = {
            maxConfidence: Math.max(...sessions.map((s) => s.validation.overallConfidence)),
          };
          break;
        case 'perfect_session':
          earned = sessions.some((s) => s.validation.overallConfidence >= 0.95);
          metadata = {
            maxConfidence: Math.max(...sessions.map((s) => s.validation.overallConfidence)),
          };
          break;
        case 'master_concept':
          earned = sessions.some((s) =>
            Object.values(s.report.conceptMastery).some((m) => (m as number) >= 0.9)
          );
          break;
      }

      if (earned) {
        const achievement = await Achievement.create({
          student: studentId,
          type: definition.type,
          title: definition.title,
          description: definition.description,
          icon: definition.icon,
          criteria: definition.criteria,
          earnedAt: new Date(),
          metadata,
        });
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  static async getAchievements(studentId: string) {
    return Achievement.find({ student: studentId }).sort({ earnedAt: -1 });
  }

  static async claimAchievement(studentId: string, achievementId: string) {
    const achievement = await Achievement.findOne({ _id: achievementId, student: studentId });
    if (!achievement) {
      throw new NotFoundError('Achievement');
    }

    achievement.claimed = true;
    await achievement.save();
    return achievement;
  }
}

export default AchievementService;
