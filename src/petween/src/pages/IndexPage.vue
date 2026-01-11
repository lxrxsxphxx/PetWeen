....<template>
  <q-page class="container column">
    <PageHeader
      title="Petween"
      subtitle="FriendsID: 123456"
    />

    <section class="section">
      <h2>Pets</h2>
      <ScrollerCards>

        <InfoCard
          v-for="i in 10"
          :key="i"
          image="/src/assets/quasar-logo-vertical.svg"
          title="Friend 1"
          info1="Dino"
          info2="Happiness 77%"

        />
      </ScrollerCards>
    </section>

    <section class="section">
      <h2>Albums</h2>
      <ScrollerCards>

        <InfoCard
          v-for="i in 10"
          :key="i"
          image="/src/assets/quasar-logo-vertical.svg"
          title="Friend 1"
          info1="3 Pictures"
          info2=""
        />
      </ScrollerCards>
    </section>
  </q-page>
</template>

<script setup lang="ts">
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import ScrollerCards from 'src/components/ui/ScrollerCards.vue'
  import InfoCard from 'src/components/ui/InfoCard.vue'
</script>

<style scoped lang="scss">
  .section {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
</style>
