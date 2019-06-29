import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'offline', loadChildren: './pages/offline/offline.module#OfflinePageModule' },
  { path: 'offlineGame', loadChildren: './pages/offline-game/offline-game.module#OfflineGamePageModule' },
  { path: 'vocList', loadChildren: './pages/voclist/voclist.module#VoclistPageModule' },
  { path: 'username', loadChildren: './pages/username/username.module#UsernamePageModule' },
  { path: 'trainingsGame', loadChildren: './pages/trainings-game/trainings-game.module#TrainingsGamePageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'registration', loadChildren: './pages/registration/registration.module#RegistrationPageModule' },
  { path: 'beforeOneVsOneGame', loadChildren: './pages/before-onevsone-game/before-onevsone-game.module#BeforeOnevsoneGamePageModule' },
  { path: 'createVoc', loadChildren: './pages/create-voc/create-voc.module#CreateVocPageModule' },
  { path: 'englishLeague', loadChildren: './pages/english-league/english-league.module#EnglishLeaguePageModule' },
  { path: 'league', loadChildren: './pages/league/league.module#LeaguePageModule' },
  { path: 'leagueGame', loadChildren: './pages/league-game/league-game.module#LeagueGamePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'name', loadChildren: './pages/name/name.module#NamePageModule' },
  { path: 'offlineEasyModusGame', loadChildren: './pages/offline-easy-modus-game/offline-easy-modus-game.module#OfflineEasyModusGamePageModule' },
  { path: 'offlineTrainingsGame', loadChildren: './pages/offline-trainings-game/offline-trainings-game.module#OfflineTrainingsGamePageModule' },
  { path: 'oneVsOne', loadChildren: './pages/onevsone/onevsone.module#OnevsonePageModule' },
  { path: 'oneVsOneChoice', loadChildren: './pages/onevsone-choice/onevsone-choice.module#OnevsoneChoicePageModule' },
  { path: 'oneVsOneGame', loadChildren: './pages/onevsone-game/onevsone-game.module#OnevsoneGamePageModule' },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
