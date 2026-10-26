<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Crypto Rank App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Crypto Rank App</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- REFRESH -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- TOP 3 -->
      <ion-grid>
        <ion-row>

          <ion-col
            v-for="item in topThree"
            :key="item.id"
            size="12"
            size-md="4"
          >
            <ion-card
              :class="['top-card', 'rank-' + item.rank]"
            >

              <ion-card-header>

                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >

                  <!-- NAMA -->
                  <div style="text-align: left;">
                    <div>
                      <strong>{{ item.name }}</strong>
                    </div>

                    <small>
                      {{ item.symbol }}
                    </small>
                  </div>

                  <!-- HARGA -->
                  <div style="text-align: right;">

                    <div>
                      <strong>
                        {{ formatCurrency(item.price_usd) }}
                      </strong>
                    </div>

                    <ion-text
                      :color="
                        isNegative(item.percent_change_24h)
                          ? 'danger'
                          : 'success'
                      "
                    >

                      <ion-icon
                        :icon="
                          isNegative(item.percent_change_24h)
                            ? caretDown
                            : caretUp
                        "
                      ></ion-icon>

                      {{ item.percent_change_24h }}%

                    </ion-text>

                  </div>

                </div>

              </ion-card-header>

              <ion-card-content>

                <ion-badge class="rank-badge">
                  #{{ item.rank }}
                </ion-badge>

              </ion-card-content>

            </ion-card>
          </ion-col>

        </ion-row>
      </ion-grid>


      <!-- LIST CRYPTO -->
      <ion-list>

        <ion-item
          v-for="item in remainingCrypto"
          :key="item.id"
        >

          <!-- RANK -->
          <ion-badge slot="start">
            #{{ item.rank }}
          </ion-badge>

          <!-- NAMA + SYMBOL -->
          <ion-label>
            <h2>{{ item.name }}</h2>
            <p>{{ item.symbol }}</p>
          </ion-label>

          <!-- HARGA -->
          <ion-label
            slot="end"
            class="ion-text-end"
          >

            <h2>
              {{ formatCurrency(item.price_usd) }}
            </h2>

            <ion-text
              :color="
                isNegative(item.percent_change_24h)
                  ? 'danger'
                  : 'success'
              "
            >

              <ion-icon
                :icon="
                  isNegative(item.percent_change_24h)
                    ? caretDown
                    : caretUp
                "
              ></ion-icon>

              {{ item.percent_change_24h }}%

            </ion-text>

          </ion-label>

        </ion-item>

      </ion-list>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonBadge,
  IonText,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonRefresher,
  IonRefresherContent
} from '@ionic/vue'

import {
  caretUp,
  caretDown
} from 'ionicons/icons'

import {
  ref,
  computed,
  onMounted
} from 'vue'


interface CryptoData {
  id: string
  rank: string
  name: string
  symbol: string
  price_usd: string
  percent_change_24h: string
}


const cryptoData = ref<CryptoData[]>([])


/* =========================
   AMBIL DATA API
========================= */

const getDataCrypto = async () => {

  try {

    const response = await fetch(
      'https://api.coinlore.net/api/tickers/'
    )

    const data = await response.json()

    cryptoData.value = data.data

  } catch (error) {

    console.error(
      'Gagal mengambil data cryptocurrency:',
      error
    )

  }

}


/* =========================
   TOP 3
========================= */

const topThree = computed(() => {
  return cryptoData.value.slice(0, 3)
})


/* =========================
   DATA MULAI RANK 4
========================= */

const remainingCrypto = computed(() => {
  return cryptoData.value.slice(3)
})


/* =========================
   FORMAT HARGA
========================= */

const formatCurrency = (price: string) => {

  const number = Number(price)

  if (isNaN(number)) {
    return 'US$0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(number)

}


/* =========================
   CEK NEGATIF
========================= */

const isNegative = (value: string) => {
  return Number(value) < 0
}


/* =========================
   REFRESH
========================= */

const handleRefresh = async (event: any) => {

  await getDataCrypto()

  event.target.complete()

}


/* =========================
   LOAD DATA
========================= */

onMounted(() => {
  getDataCrypto()
})

</script>


<style scoped>

/* =========================
   TOP CARD
========================= */

.top-card {

  position: relative;

  overflow: hidden;

  border-radius: 16px;

  background: #1e1e1e;

  color: #ffffff;

  display: flex;

  flex-direction: column;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  border:
    1px solid rgba(255, 255, 255, 0.05);

}


/* =========================
   EFEK HOVER
========================= */

.top-card:hover {

  transform: translateY(-4px);

  box-shadow:
    0 12px 20px rgba(0, 0, 0, 0.3);

}


/* =========================
   CARD HEADER & CONTENT
========================= */

.top-card ion-card-header,
.top-card ion-card-content {

  position: relative;

  z-index: 2;

  padding: 16px;

}


/* =========================
   BAGIAN ISI HEADER
========================= */

.top-card ion-card-header > div {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 8px;

}


/* =========================
   NAMA CRYPTO
========================= */

.top-card ion-card-header strong {

  font-size: 1.1rem;

  font-weight: 700;

  display: block;

  color: #ffffff;

}


/* =========================
   SYMBOL
========================= */

.top-card ion-card-header small {

  font-size: 0.85rem;

  color: rgba(255, 255, 255, 0.45);

}


/* =========================
   HARGA
========================= */

.top-card ion-card-header > div > div:last-child strong {

  font-size: 1.3rem;

  font-weight: 800;

  display: block;

  margin-bottom: 4px;

}


/* =========================
   PERSEN
========================= */

.top-card ion-card-header ion-text {

  font-size: 0.9rem;

  font-weight: 600;

}


/* =========================
   RANK BESAR
========================= */

.top-card .rank-badge {

  position: absolute;

  right: 10px;

  bottom: 15px;

  background: transparent !important;

  border: none;

  box-shadow: none;

  font-size: 6rem;

  font-weight: 900;

  font-style: italic;

  color: #ffffff;

  opacity: 0.05;

  z-index: 0;

  pointer-events: none;

  padding: 0;

  margin: 0;

}


/* =========================
   WARNA CARD TOP 3
========================= */

.top-card.rank-1 {

  background:
    linear-gradient(
      135deg,
      rgba(100, 100, 0, 0.35),
      #1e1e1e 55%
    );

}


.top-card.rank-2 {

  background:
    linear-gradient(
      135deg,
      rgba(100, 100, 100, 0.2),
      #1e1e1e 55%
    );

}


.top-card.rank-3 {

  background:
    linear-gradient(
      135deg,
      rgba(120, 70, 20, 0.25),
      #1e1e1e 55%
    );

}


/* =========================
   LIST CRYPTO
========================= */

ion-list {

  background: #1e1e1e;

}


ion-item {

  --background: #1e1e1e;

  --color: #ffffff;

  --border-color:
    rgba(255, 255, 255, 0.08);

  --padding-start: 15px;

  --padding-end: 15px;

}


/* =========================
   RANK LIST
========================= */

ion-item ion-badge {

  margin-right: 12px;

}


/* =========================
   NAMA CRYPTO LIST
========================= */

ion-item ion-label h2 {

  font-size: 1rem;

  font-weight: 600;

  color: #ffffff;

  margin-bottom: 3px;

}


ion-item ion-label p {

  font-size: 0.8rem;

  color: rgba(255, 255, 255, 0.5);

}


/* =========================
   HARGA LIST
========================= */

ion-item ion-label[slot="end"] h2 {

  font-size: 0.95rem;

  font-weight: 700;

  color: #ffffff;

  margin-bottom: 4px;

}


ion-item ion-label[slot="end"] ion-text {

  font-size: 0.75rem;

  font-weight: 600;

}


/* =========================
   ICON
========================= */

ion-icon {

  vertical-align: middle;

}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

  .top-card {

    margin: 8px 10px;

  }

  .top-card ion-card-header strong {

    font-size: 1rem;

  }

  .top-card ion-card-header > div > div:last-child strong {

    font-size: 1.05rem;

  }

}


/* =========================
   DESKTOP
   3 CARD SEJAJAR
========================= */

@media (min-width: 768px) {

  ion-grid {

    padding: 10px 12px;

  }

  .top-card {

    height: 138px;

    margin: 0;

  }

}

</style>